from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor
import traceback
import secrets
import hashlib
import jwt

# Load environment variables
load_dotenv()

# JWT Configuration
SECRET_KEY = os.getenv('JWT_SECRET', 'secret')
ALGORITHM = 'HS256'

# Create FastAPI app
app = FastAPI(title="Jira Clone API", version="1.0.0")

# Enable CORS with explicit configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all exceptions and ensure CORS headers are sent"""
    print(f"Error: {str(exc)}")
    print(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": f"Internal server error: {str(exc)}",
                "status": 500,
                "data": {}
            }
        },
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
        }
    )

# Database connection function
def get_db_connection():
    """Create a database connection"""
    return psycopg2.connect(
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT'),
        database=os.getenv('DB_DATABASE'),
        user=os.getenv('DB_USERNAME'),
        password=os.getenv('DB_PASSWORD'),
        cursor_factory=RealDictCursor
    )

# Pydantic models for response
class User(BaseModel):
    id: int
    name: str
    email: str
    avatarUrl: Optional[str] = None
    role: Optional[str] = None

class Issue(BaseModel):
    id: str
    title: str
    type: str = "task"
    status: str = "backlog"
    priority: str = "3"
    listPosition: float = 0
    description: str = ""
    descriptionText: str = ""
    estimate: Optional[int] = None
    timeSpent: int = 0
    timeRemaining: Optional[int] = None
    reporterId: int
    projectId: int
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
    userIds: List[int] = []
    users: List[User] = []

class Project(BaseModel):
    id: int
    name: str
    url: Optional[str] = None
    description: Optional[str] = None
    category: str = "software"
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
    issues: List[Issue] = []
    users: List[User] = []

class ProjectResponse(BaseModel):
    project: Project

class CurrentUserResponse(BaseModel):
    currentUser: User

@app.get("/")
def read_root():
    return {"message": "Ticket Tracker API is running!"}

# Authentication dependency function
async def get_current_user(request: Request):
    """Get current user from JWT token"""
    try:
        # Get token from Authorization header
        authorization: str = request.headers.get("Authorization")
        
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        token = authorization.split(" ")[1]
        
        # Decode JWT token
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("email")
            if email is None:
                raise HTTPException(status_code=401, detail="Invalid token")
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get user from database
        conn = get_db_connection()
        cur = conn.cursor()
        
        try:
            cur.execute('SELECT * FROM "user" WHERE email = %s', (email,))
            user = cur.fetchone()
            
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
            
            return {
                'id': user['id'],
                'email': user['email'],
                'name': user['name'],
                'role': user['role'],
                'avatarUrl': user['avatarUrl']
            }
        finally:
            cur.close()
            conn.close()
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authentication failed")

@app.get("/projects")
async def get_projects(current_user: dict = Depends(get_current_user)):
    """Get all projects for the current user"""
    user_id = current_user['id']
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Get all projects the user has access to
        cur.execute("""
            SELECT p.*, up.role as user_role
            FROM project p
            JOIN user_project up ON p.id = up.project_id
            WHERE up.user_id = %s
            ORDER BY p."created_at" DESC
        """, (user_id,))
        
        projects = cur.fetchall()
        
        return {
            "projects": [
                {
                    "id": p['id'],
                    "name": p['name'],
                    "url": p['url'],
                    "description": p['description'],
                    "category": p['category'],
                    "createdAt": p['created_at'].isoformat() if p['created_at'] else None,
                    "updated_at": p['updated_at'].isoformat() if p['updated_at'] else None,
                    "userRole": p['user_role']
                }
                for p in projects
            ]
        }
    finally:
        cur.close()
        conn.close()

# Get all projects (admin only)
@app.get("/admin/projects")
async def get_all_projects(current_user: dict = Depends(get_current_user)):
    """Get all projects in the system (admin only)"""
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if current user is admin
        if current_user.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Only admins can view all projects")
        
        print(f"DEBUG: Admin {current_user['email']} requesting all projects")
        
        cur.execute("""
            SELECT p.*, u.name as owner_name, u.email as owner_email,
                   COUNT(up.user_id) as member_count
            FROM project p
            LEFT JOIN "user" u ON p.owner_id = u.id
            LEFT JOIN user_project up ON p.id = up.project_id
            GROUP BY p.id, u.name, u.email
            ORDER BY p."created_at" DESC
        """)
        
        projects = cur.fetchall()
        
        return {
            "projects": [
                {
                    "id": p['id'],
                    "name": p['name'],
                    "url": p['url'],
                    "description": p['description'],
                    "category": p['category'],
                    "createdAt": p['created_at'].isoformat() if p['created_at'] else None,
                    "updated_at": p['updated_at'].isoformat() if p['updated_at'] else None,
                    "ownerName": p['owner_name'],
                    "ownerEmail": p['owner_email'],
                    "memberCount": p['member_count']
                }
                for p in projects
            ]
        }
    finally:
        cur.close()
        conn.close()

# Delete project (admin only)
@app.delete("/projects/{project_id}")
async def delete_project(project_id: int, current_user: dict = Depends(get_current_user)):
    """Delete a project and all associated data (admin only)"""
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if current user is admin
        if current_user.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Only admins can delete projects")
        
        # Check if project exists
        cur.execute('SELECT name FROM project WHERE id = %s', (project_id,))
        project = cur.fetchone()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        print(f"DEBUG: Admin {current_user['email']} deleting project {project_id} ({project['name']})")
        
        # Delete in correct order to maintain referential integrity
        # 1. Delete issues (which will cascade to comments, etc.)
        cur.execute('DELETE FROM issue WHERE "projectId" = %s', (project_id,))
        deleted_issues = cur.rowcount
        print(f"DEBUG: Deleted {deleted_issues} issues")
        
        # 2. Delete user_project associations
        cur.execute('DELETE FROM user_project WHERE project_id = %s', (project_id,))
        deleted_members = cur.rowcount
        print(f"DEBUG: Deleted {deleted_members} member associations")
        
        # 3. Delete the project itself
        cur.execute('DELETE FROM project WHERE id = %s', (project_id,))
        
        conn.commit()
        
        return {
            "message": f"Project '{project['name']}' deleted successfully",
            "deleted_issues": deleted_issues,
            "deleted_member_associations": deleted_members
        }
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        print(f"ERROR deleting project: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.get("/project/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, current_user: dict = Depends(get_current_user)):
    """Get a specific project with all its issues and users"""
    user_id = current_user['id']
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if user has access to this project
        cur.execute("""
            SELECT role FROM user_project 
            WHERE user_id = %s AND project_id = %s
        """, (user_id, project_id))
        access = cur.fetchone()
        
        if not access:
            raise HTTPException(status_code=403, detail="Access denied to this project")
        
        # Get project
        cur.execute("""
            SELECT 
                id,
                name,
                url,
                description,
                category,
                "created_at",
                "updated_at"
            FROM project 
            WHERE id = %s
        """, (project_id,))
        project_data = cur.fetchone()
        
        if not project_data:
            raise HTTPException(status_code=404, detail="No project found")
        
        # Get issues for the project
        cur.execute("""
            SELECT 
                i.id,
                i.title,
                i.type,
                i.status,
                i.priority,
                i."listPosition",
                i.description,
                i."descriptionText",
                i.estimate,
                i."timeSpent",
                i."timeRemaining",
                i."reporterId",
                i."projectId",
                i."created_at",
                i."updated_at",
                u.name as reporter_name,
                u.email as reporter_email,
                u."avatarUrl" as reporter_avatar
            FROM issue i
            LEFT JOIN "user" u ON i."reporterId" = u.id
            WHERE i."projectId" = %s
            ORDER BY i."listPosition", i.id
        """, (project_data['id'],))
        issues_data = cur.fetchall()
        
        # Get project members only
        cur.execute("""
            SELECT u.id, u.name, u.email, u."avatarUrl"
            FROM "user" u
            JOIN user_project up ON u.id = up.user_id
            WHERE up.project_id = %s
            ORDER BY u.name
        """, (project_id,))
        users_data = cur.fetchall()
        
        # Format issues
        issues = []
        for issue in issues_data:
            # Get assignees for this issue from issue_user table
            cur.execute("""
                SELECT u.id, u.name, u.email, u."avatarUrl"
                FROM "user" u
                JOIN issue_user iu ON u.id = iu.user_id
                WHERE iu.issue_id = %s
            """, (issue['id'],))
            assignee_users = cur.fetchall()
            
            issue_obj = Issue(
                id=str(issue['id']),
                title=issue['title'],
                type=issue['type'] or "task",
                status=issue['status'] or "backlog",
                priority=issue['priority'] or "3",
                listPosition=float(issue['listPosition']) if issue['listPosition'] else 0,
                description=f"<p>{issue['description']}</p>" if issue['description'] else "",
                descriptionText=issue['descriptionText'] or issue['description'] or "",
                estimate=issue['estimate'],
                timeSpent=issue['timeSpent'] or 0,
                timeRemaining=issue['timeRemaining'],
                reporterId=issue['reporterId'],
                projectId=issue['projectId'],
                createdAt=issue['created_at'].isoformat() if issue['created_at'] else None,
                updatedAt=issue['updated_at'].isoformat() if issue['updated_at'] else None,
                userIds=[user['id'] for user in assignee_users],
                users=[{
                    "id": user['id'],
                    "name": user['name'],
                    "email": user['email'],
                    "avatarUrl": user['avatarUrl']
                } for user in assignee_users]
            )
            issues.append(issue_obj)
        
        # Format users
        users = []
        for user in users_data:
            user_obj = User(
                id=user['id'],
                name=user['name'],
                email=user['email'],
                avatarUrl=user['avatarUrl']
            )
            users.append(user_obj)
        
        # Create project response
        project = Project(
            id=project_data['id'],
            name=project_data['name'],
            url=project_data['url'],
            description=project_data['description'],
            category=project_data['category'],
            createdAt=project_data['created_at'].isoformat() if project_data['created_at'] else None,
            updatedAt=project_data['updated_at'].isoformat() if project_data['updated_at'] else None,
            issues=issues,
            users=users
        )
        
        return ProjectResponse(project=project)
        
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        cur.close()
        conn.close()

@app.get("/issues")
def get_issues():
    """Get all issues"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT i.*, u.name as reporter_name, u.email as reporter_email
            FROM issue i
            LEFT JOIN "user" u ON i."reporterId" = u.id
            ORDER BY i."listPosition", i.id
        """)
        issues_data = cur.fetchall()
        
        issues = []
        for issue in issues_data:
            issues.append({
                "id": str(issue['id']),
                "title": issue['title'],
                "type": issue['type'] or "task",
                "status": issue['status'] or "backlog",
                "priority": issue['priority'] or "3",
                "projectId": issue['projectid']
            })
        
        return {"issues": issues}
        
    finally:
        cur.close()
        conn.close()

# Duplicate endpoint removed - using the admin-only version below

# Duplicate function removed - moved above

@app.get("/currentUser", response_model=CurrentUserResponse)
async def get_current_user_endpoint(current_user: dict = Depends(get_current_user)):
    """Get the current authenticated user"""
    user = User(
        id=current_user['id'],
        name=current_user['name'],
        email=current_user['email'],
        avatarUrl=current_user['avatarUrl'],
        role=current_user['role']
    )
    
    return CurrentUserResponse(currentUser=user)


@app.get("/issues/{issue_id}")
def get_issue(issue_id: int):
    """Get a single issue by ID"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT 
                i.id,
                i.title,
                i.type,
                i.status,
                i.priority,
                i."listPosition",
                i.description,
                i."descriptionText",
                i.estimate,
                i."timeSpent",
                i."timeRemaining",
                i."reporterId",
                i."projectId",
                i."created_at",
                i."updated_at",
                i.due_date,
                u.name as reporter_name,
                u.email as reporter_email,
                u."avatarUrl" as reporter_avatar
            FROM issue i
            LEFT JOIN "user" u ON i."reporterId" = u.id
            WHERE i.id = %s
        """, (issue_id,))
        issue_data = cur.fetchone()
        
        if not issue_data:
            return JSONResponse(
                status_code=404,
                content={
                    "error": {
                        "code": "ISSUE_NOT_FOUND",
                        "message": f"Issue {issue_id} not found",
                        "status": 404,
                        "data": {}
                    }
                }
            )
        
        # No comments table exists yet, return empty array
        # Get assignees for this issue from issue_user table
        cur.execute("""
            SELECT u.id, u.name, u.email, u."avatarUrl"
            FROM "user" u
            JOIN issue_user iu ON u.id = iu.user_id
            WHERE iu.issue_id = %s
        """, (issue_id,))
        assignee_users = cur.fetchall()
        
        # Get comments for this issue
        cur.execute("""
            SELECT c.id, c.body, c."created_at", c."updated_at",
                   u.id as user_id, u.name, u.email, u."avatarUrl"
            FROM comment c
            JOIN "user" u ON c."userId" = u.id
            WHERE c."issueId" = %s
            ORDER BY c."created_at" ASC
        """, (issue_id,))
        comments_data = cur.fetchall()
        
        comments = []
        for comment in comments_data:
            comments.append({
                "id": str(comment['id']),
                "body": comment['body'],
                "createdAt": comment['created_at'].isoformat() if comment['created_at'] else None,
                "updatedAt": comment['updated_at'].isoformat() if comment['updated_at'] else None,
                "user": {
                    "id": comment['user_id'],
                    "name": comment['name'],
                    "email": comment['email'],
                    "avatarUrl": comment['avatarUrl']
                }
            })
        
        return {
            "issue": {
                "id": str(issue_data['id']),
                "title": issue_data['title'],
                "type": issue_data['type'] or "task",
                "status": issue_data['status'] or "backlog",
                "priority": issue_data['priority'] or "3",
                "listPosition": float(issue_data['listPosition']) if issue_data['listPosition'] else 0,
                "description": f"<p>{issue_data['description']}</p>" if issue_data['description'] else "",
                "descriptionText": issue_data['descriptionText'] or issue_data['description'] or "",
                "estimate": issue_data['estimate'],
                "timeSpent": issue_data['timeSpent'] or 0,
                "timeRemaining": issue_data['timeRemaining'],
                "reporterId": issue_data['reporterId'],
                "projectId": issue_data['projectId'],
                "createdAt": issue_data['created_at'].isoformat() if issue_data['created_at'] else None,
                "updatedAt": issue_data['updated_at'].isoformat() if issue_data['updated_at'] else None,
                "dueDate": issue_data['due_date'].isoformat() if issue_data['due_date'] else None,
                "userIds": [user['id'] for user in assignee_users],
                "users": [{
                    "id": user['id'],
                    "name": user['name'],
                    "email": user['email'],
                    "avatarUrl": user['avatarUrl']
                } for user in assignee_users],
                "comments": comments
            }
        }
    finally:
        cur.close()
        conn.close()

@app.put("/issues/{issue_id}")
def update_issue(issue_id: int, issue_update: dict):
    """Update an issue"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Build update query dynamically based on provided fields
        update_fields = []
        values = []
        
        # Map frontend field names to database column names
        field_mapping = {
            'title': 'title',
            'type': 'type',
            'status': 'status',
            'priority': 'priority',
            'listPosition': '"listPosition"',
            'description': 'description',
            'descriptionText': '"descriptionText"',
            'estimate': 'estimate',
            'timeSpent': '"timeSpent"',
            'timeRemaining': '"timeRemaining"',
            'reporterId': '"reporterId"',
            'dueDate': 'due_date'
        }
        
        # Handle assignee updates separately
        assignee_user_ids = None
        if 'userIds' in issue_update:
            assignee_user_ids = issue_update.pop('userIds')  # Remove from regular updates
            print(f"DEBUG: Updating assignees for issue {issue_id}: {assignee_user_ids}")
        
        for field, value in issue_update.items():
            if field in field_mapping:
                update_fields.append(f'{field_mapping[field]} = %s')
                values.append(value)
        
        # Always update timestamp even if no other fields changed
        update_fields.append('"updated_at" = %s')
        values.append(datetime.now())
        
        # Add issue_id for WHERE clause
        values.append(issue_id)
        
        # Update issue fields if any
        if len(update_fields) > 1:  # More than just updated_at
            query = f"""
                UPDATE issue 
                SET {', '.join(update_fields)}
                WHERE id = %s
                RETURNING 
                    id,
                    title,
                    type,
                    status,
                    priority,
                    "listPosition",
                    description,
                    "descriptionText",
                    estimate,
                    "timeSpent",
                    "timeRemaining",
                    "reporterId",
                    "projectId",
                    "created_at",
                    "updated_at",
                    due_date
            """
            
            cur.execute(query, values)
            updated_issue = cur.fetchone()
        else:
            # Just get the current issue if only updating assignees
            cur.execute("""
                SELECT 
                    id, title, type, status, priority, "listPosition",
                    description, "descriptionText", estimate, "timeSpent",
                    "timeRemaining", "reporterId", "projectId", "created_at", "updated_at", due_date
                FROM issue WHERE id = %s
            """, (issue_id,))
            updated_issue = cur.fetchone()
        
        if not updated_issue:
            return JSONResponse(
                status_code=404,
                content={
                    "error": {
                        "code": "ISSUE_NOT_FOUND",
                        "message": f"Issue {issue_id} not found",
                        "status": 404,
                        "data": {}
                    }
                }
            )
        
        # Update assignees if provided
        if assignee_user_ids is not None:
            # Remove all current assignees
            cur.execute("DELETE FROM issue_user WHERE issue_id = %s", (issue_id,))
            
            # Add new assignees
            for user_id in assignee_user_ids:
                if user_id:  # Only insert valid user IDs
                    cur.execute("""
                        INSERT INTO issue_user (issue_id, user_id)
                        VALUES (%s, %s)
                        ON CONFLICT (issue_id, user_id) DO NOTHING
                    """, (issue_id, user_id))
                    print(f"DEBUG: Assigned user {user_id} to issue {issue_id}")
        
        # Get current assignees for response
        cur.execute("""
            SELECT u.id, u.name, u.email, u."avatarUrl"
            FROM "user" u
            JOIN issue_user iu ON u.id = iu.user_id
            WHERE iu.issue_id = %s
        """, (issue_id,))
        assignee_users = cur.fetchall()
        
        conn.commit()
        
        # Return the full updated issue to ensure frontend has all the data
        return {
            "id": str(updated_issue['id']),
            "title": updated_issue['title'],
            "type": updated_issue['type'] or "task",
            "status": updated_issue['status'] or "backlog",
            "priority": updated_issue['priority'] or "3",
            "listPosition": float(updated_issue['listPosition']) if updated_issue['listPosition'] else 0,
            "description": updated_issue['description'] or "",
            "descriptionText": updated_issue['descriptionText'] or updated_issue['description'] or "",
            "estimate": updated_issue['estimate'],
            "timeSpent": updated_issue['timeSpent'] or 0,
            "timeRemaining": updated_issue['timeRemaining'],
            "reporterId": updated_issue['reporterId'],
            "projectId": updated_issue['projectId'],
            "createdAt": updated_issue['created_at'].isoformat() if updated_issue['created_at'] else None,
            "updatedAt": updated_issue['updated_at'].isoformat() if updated_issue['updated_at'] else None,
            "dueDate": updated_issue['due_date'].isoformat() if updated_issue['due_date'] else None,
            "userIds": [user['id'] for user in assignee_users],
            "users": [{
                "id": user['id'],
                "name": user['name'],
                "email": user['email'],
                "avatarUrl": user['avatarUrl']
            } for user in assignee_users]
        }
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()

@app.post("/issues")
def create_issue(issue_data: dict):
    """Create a new issue"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Set default values
        issue_data.setdefault('type', 'task')
        issue_data.setdefault('status', 'backlog')
        issue_data.setdefault('priority', '3')
        issue_data.setdefault('listPosition', 99999)  # Put at end of list
        issue_data.setdefault('description', '')
        issue_data.setdefault('descriptionText', '')
        issue_data.setdefault('estimate', None)
        issue_data.setdefault('timeSpent', 0)
        issue_data.setdefault('timeRemaining', None)
        
        # Extract assignee user IDs (separate from reporter)
        assignee_user_ids = issue_data.get('userIds', [])
        if isinstance(assignee_user_ids, list) and len(assignee_user_ids) > 0:
            # Convert users array to userIds if needed
            if 'users' in issue_data and isinstance(issue_data['users'], list):
                assignee_user_ids.extend([user.get('id') for user in issue_data['users'] if user.get('id')])
        
        print(f"DEBUG: Creating issue with assignees: {assignee_user_ids}")
        
        # Insert the issue
        cur.execute("""
            INSERT INTO issue (
                title, type, status, priority, "listPosition",
                description, "descriptionText", estimate, "timeSpent",
                "timeRemaining", "reporterId", "projectId", due_date
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            ) RETURNING 
                id, title, type, status, priority, "listPosition",
                description, "descriptionText", estimate, "timeSpent",
                "timeRemaining", "reporterId", "projectId", created_at, updated_at, due_date
        """, (
            issue_data['title'],
            issue_data['type'],
            issue_data['status'],
            issue_data['priority'],
            issue_data['listPosition'],
            issue_data['description'],
            issue_data['descriptionText'],
            issue_data.get('estimate'),
            issue_data['timeSpent'],
            issue_data.get('timeRemaining'),
            issue_data.get('reporterId', 1),  # Default to user 1
            issue_data.get('projectId', 1),   # Default to project 1
            issue_data.get('dueDate'),
        ))
        
        new_issue = cur.fetchone()
        issue_id = new_issue['id']
        
        # Insert assignees into issue_user table (separate from reporter)
        for user_id in assignee_user_ids:
            if user_id:  # Only insert valid user IDs
                cur.execute("""
                    INSERT INTO issue_user (issue_id, user_id)
                    VALUES (%s, %s)
                    ON CONFLICT (issue_id, user_id) DO NOTHING
                """, (issue_id, user_id))
                print(f"DEBUG: Assigned user {user_id} to issue {issue_id}")
        
        conn.commit()
        
        # Get assignee users for response
        cur.execute("""
            SELECT u.id, u.name, u.email, u."avatarUrl"
            FROM "user" u
            JOIN issue_user iu ON u.id = iu.user_id
            WHERE iu.issue_id = %s
        """, (issue_id,))
        assignee_users = cur.fetchall()
        
        # Return the created issue
        return {
            "issue": {
                "id": str(new_issue['id']),
                "title": new_issue['title'],
                "type": new_issue['type'],
                "status": new_issue['status'],
                "priority": new_issue['priority'],
                "listPosition": float(new_issue['listPosition']),
                "description": new_issue['description'] or "",
                "descriptionText": new_issue['descriptionText'] or new_issue['description'] or "",
                "estimate": new_issue['estimate'],
                "timeSpent": new_issue['timeSpent'] or 0,
                "timeRemaining": new_issue['timeRemaining'],
                "reporterId": new_issue['reporterId'],
                "projectId": new_issue['projectId'],
                "createdAt": new_issue['created_at'].isoformat() if new_issue['created_at'] else None,
                "updatedAt": new_issue['updated_at'].isoformat() if new_issue['updated_at'] else None,
                "dueDate": new_issue['due_date'].isoformat() if new_issue['due_date'] else None,
                "userIds": [user['id'] for user in assignee_users],
                "users": [{
                    "id": user['id'],
                    "name": user['name'],
                    "email": user['email'],
                    "avatarUrl": user['avatarUrl']
                } for user in assignee_users]
            }
        }
        
    except Exception as e:
        conn.rollback()
        print(f"Error creating issue: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.delete("/issues/{issue_id}")
def delete_issue(issue_id: int):
    """Delete an issue"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("DELETE FROM issue WHERE id = %s RETURNING id", (issue_id,))
        deleted = cur.fetchone()
        
        if not deleted:
            raise HTTPException(status_code=404, detail="Issue not found")
        
        conn.commit()
        return {"message": "Issue deleted successfully"}
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# Authentication models
class LoginRequest(BaseModel):
    email: str
    password: str

class GoogleLoginRequest(BaseModel):
    token: str
    email: str
    name: str
    picture: Optional[str]
    googleId: str

class AuthResponse(BaseModel):
    token: str
    user: User

# Authentication helper functions
def hash_password(password: str) -> str:
    """Hash a password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_token(user_id: int) -> str:
    """Create a JWT token for a user"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> Optional[int]:
    """Verify a JWT token and return user_id"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get('user_id')
    except:
        return None

# Removed duplicate function - using the new one above

# Authentication endpoints
@app.post("/auth/login")
def login(login_data: LoginRequest):
    """Login with email and password"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            'SELECT * FROM "user" WHERE email = %s AND password = %s',
            (login_data.email, hash_password(login_data.password))
        )
        user = cur.fetchone()
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Update last login
        cur.execute(
            'UPDATE "user" SET last_login = %s WHERE id = %s',
            (datetime.now(), user['id'])
        )
        
        # Create session token
        token = create_token(user['id'])
        
        # Store session
        cur.execute(
            'INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)',
            (user['id'], token, datetime.now() + timedelta(days=7))
        )
        
        conn.commit()
        
        return {
            "token": token,
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user['email'],
                "avatarUrl": user['avatarUrl'],
                "role": user['role']
            }
        }
    finally:
        cur.close()
        conn.close()

# Test login endpoint removed

@app.post("/auth/google")
def google_login(google_data: GoogleLoginRequest):
    """Login with Google"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if user exists - prioritize exact email match
        print(f"Google login attempt: {google_data.email} with Google ID: {google_data.googleId}")
        
        # First try exact email match
        cur.execute(
            'SELECT * FROM "user" WHERE email = %s',
            (google_data.email,)
        )
        user = cur.fetchone()
        
        print(f"Found user by email: {dict(user) if user else None}")
        
        # If no email match, DO NOT try Google ID to avoid conflicts
        if not user:
            print(f"No user found with email {google_data.email}")
            # Check if this email is in the admin list
            admin_emails = ['']  # Only one admin email
            if google_data.email in admin_emails:
                # Create new admin user
                cur.execute("""
                    INSERT INTO "user" (name, email, "avatarUrl", google_id, role)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING *
                """, (
                    google_data.name,
                    google_data.email,
                    google_data.picture,
                    google_data.googleId,
                    'admin'
                ))
                user = cur.fetchone()
            else:
                # Check if user exists in database (added by admin)
                cur.execute("""
                    SELECT * FROM "user" WHERE email = %s
                """, (google_data.email,))
                existing_user = cur.fetchone()
                
                if not existing_user:
                    raise HTTPException(
                        status_code=403,
                        detail="You are not authorized to access this application. Please contact an administrator to be added as a project member."
                    )
                
                # Update existing user with Google info
                cur.execute("""
                    UPDATE "user" SET 
                    name = CASE WHEN name = email THEN %s ELSE name END,
                    "avatarUrl" = %s, 
                    google_id = %s,
                    last_login = %s
                    WHERE email = %s
                    RETURNING *
                """, (
                    google_data.name,
                    google_data.picture,
                    google_data.googleId,
                    datetime.now(),
                    google_data.email
                ))
                user = cur.fetchone()
        else:
            # Update google_id and avatar - but only if email matches exactly
            if user['email'] == google_data.email:
                cur.execute(
                    'UPDATE "user" SET google_id = %s, "avatarUrl" = %s WHERE id = %s',
                    (google_data.googleId, google_data.picture, user['id'])
                )
                print(f"Updated existing user {user['email']} with Google data")
            else:
                print(f"Email mismatch: DB has {user['email']}, Google login is {google_data.email}")
        
        # Update last login
        cur.execute(
            'UPDATE "user" SET last_login = %s WHERE id = %s',
            (datetime.now(), user['id'])
        )
        
        # Create session token with email and role
        token_data = {
            'user_id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(days=7)
        }
        token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        
        # Clear any existing sessions for this user
        cur.execute('DELETE FROM sessions WHERE user_id = %s', (user['id'],))
        
        # Store session
        cur.execute(
            'INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)',
            (user['id'], token, datetime.now() + timedelta(days=7))
        )
        
        conn.commit()
        
        return {
            "token": token,
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user['email'],
                "avatarUrl": google_data.picture or user['avatarUrl'],
                "role": user['role']
            }
        }
    finally:
        cur.close()
        conn.close()

@app.post("/auth/simple-login")
def simple_login(login_data: dict):
    """Simple login for admin users with email only"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if user exists and is admin
        cur.execute(
            'SELECT * FROM "user" WHERE email = %s',
            (login_data.get('email'),)
        )
        user = cur.fetchone()
        
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        # Only allow email-only login for admin users
        if user['role'] != 'admin':
            raise HTTPException(status_code=401, detail="Email-only login is restricted to admin users")
        
        # Update last login
        cur.execute(
            'UPDATE "user" SET last_login = %s WHERE id = %s',
            (datetime.now(), user['id'])
        )
        
        # Create session token
        token = create_token(user['id'])
        
        # Store session
        cur.execute(
            'INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)',
            (user['id'], token, datetime.now() + timedelta(days=7))
        )
        
        conn.commit()
        
        return {
            "token": token,
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user['email'],
                "avatarUrl": user['avatarUrl'],
                "role": user['role']
            }
        }
    finally:
        cur.close()
        conn.close()

@app.post("/auth/logout")
async def logout(request: Request):
    """Logout current user"""
    user_id = await get_current_user(request)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        auth_header = request.headers.get('Authorization')
        token = auth_header.split(' ')[1]
        
        cur.execute('DELETE FROM sessions WHERE token = %s', (token,))
        conn.commit()
        
        return {"message": "Logged out successfully"}
    finally:
        cur.close()
        conn.close()

# Update the currentUser endpoint to use authentication
# Removed duplicate endpoint

# Create new user (admin only)
@app.post("/users")
async def create_user(user_data: dict, current_user: dict = Depends(get_current_user)):
    """Create a new user (admin only)"""
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if current user is admin
        if current_user.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Only admins can create users")
        
        print(f"DEBUG: Admin {current_user['email']} creating user with data: {user_data}")
        
        # Check if email already exists
        cur.execute('SELECT id FROM "user" WHERE email = %s', (user_data.get('email'),))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="Email already exists")
        
        # Create user - generate name from email if not provided
        email = user_data.get('email')
        name = user_data.get('name') or email.split('@')[0] if email else 'Unknown User'
        role = user_data.get('role', 'user')
        avatar_url = user_data.get('avatarUrl')  # Let frontend handle missing avatars with initials
        
        print(f"DEBUG: Creating user with name='{name}', email='{email}', role='{role}'")
        
        cur.execute("""
            INSERT INTO "user" (name, email, role, "avatarUrl")
            VALUES (%s, %s, %s, %s)
            RETURNING *
        """, (name, email, role, avatar_url))
        
        new_user = cur.fetchone()
        conn.commit()
        
        return {
            "user": {
                "id": new_user['id'],
                "name": new_user['name'],
                "email": new_user['email'],
                "avatarUrl": new_user['avatarUrl'],
                "role": new_user['role'],
                "createdAt": new_user['created_at'].isoformat() if new_user['created_at'] else None
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# Get all users (admin only)
@app.get("/users")
async def get_users(current_user: dict = Depends(get_current_user)):
    """Get all users (admin only)"""
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if current user is admin
        if current_user.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Only admins can view all users")
        
        print(f"DEBUG: Admin {current_user['email']} requesting all users")
        
        # Get all users
        cur.execute("""
            SELECT id, name, email, "avatarUrl", role, "created_at", last_login
            FROM "user"
            ORDER BY "created_at" DESC
        """)
        
        users = cur.fetchall()
        
        return {
            "users": [
                {
                    "id": u['id'],
                    "name": u['name'],
                    "email": u['email'],
                    "avatarUrl": u['avatarUrl'],
                    "role": u['role'],
                    "createdAt": u['created_at'].isoformat() if u['created_at'] else None,
                    "lastLogin": u['last_login'].isoformat() if u['last_login'] else None
                }
                for u in users
            ]
        }
    finally:
        cur.close()
        conn.close()

# Delete user (admin only)
@app.delete("/users/{user_id}")
async def delete_user(user_id: int, current_user: dict = Depends(get_current_user)):
    """Delete a user (admin only)"""
    current_user_id = current_user['id']
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if current user is admin
        if current_user.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Only admins can delete users")
        
        # Don't allow self-deletion
        if user_id == current_user_id:
            raise HTTPException(status_code=400, detail="Cannot delete your own account")
        
        # Check if user exists
        cur.execute('SELECT id, name, email FROM "user" WHERE id = %s', (user_id,))
        user_to_delete = cur.fetchone()
        
        if not user_to_delete:
            raise HTTPException(status_code=404, detail="User not found")
        
        print(f"DEBUG: Deleting user {user_id} ({user_to_delete['email']}) by admin {current_user['email']}")
        
        # Remove user from all projects first (to maintain referential integrity)
        cur.execute('DELETE FROM user_project WHERE user_id = %s', (user_id,))
        deleted_project_associations = cur.rowcount
        print(f"DEBUG: Removed {deleted_project_associations} project associations")
        
        # Remove user from sessions table
        cur.execute('DELETE FROM sessions WHERE user_id = %s', (user_id,))
        deleted_sessions = cur.rowcount
        print(f"DEBUG: Removed {deleted_sessions} sessions")
        
        # Handle issues where this user is the reporter
        # Don't delete issues, just set reporterId to NULL to preserve the issues
        cur.execute('UPDATE issue SET "reporterId" = NULL WHERE "reporterId" = %s', (user_id,))
        updated_issues = cur.rowcount
        print(f"DEBUG: Updated {updated_issues} issues to remove deleted user as reporter")
        
        # Delete the user
        cur.execute('DELETE FROM "user" WHERE id = %s', (user_id,))
        deleted_users = cur.rowcount
        
        if deleted_users == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        print(f"DEBUG: Successfully deleted user {user_to_delete['email']}")
        
        conn.commit()
        
        return {
            "message": f"User {user_to_delete['email']} deleted successfully",
            "deletedUser": {
                "id": user_to_delete['id'],
                "name": user_to_delete['name'],
                "email": user_to_delete['email']
            }
        }
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        print(f"DEBUG: Error deleting user: {str(e)}")
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# Update user (admin only)
@app.put("/users/{user_id}")
async def update_user(user_id: int, user_data: dict, current_user: dict = Depends(get_current_user)):
    """Update a user's information and role (admin only)"""
    current_user_id = current_user['id']
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if current user is admin
        if current_user.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Only admins can update users")
        
        # Check if user exists
        cur.execute('SELECT id, name, email, role, "avatarUrl" FROM "user" WHERE id = %s', (user_id,))
        user_to_update = cur.fetchone()
        
        if not user_to_update:
            raise HTTPException(status_code=404, detail="User not found")
        
        print(f"DEBUG: Updating user {user_id} ({user_to_update['email']}) by admin {current_user['email']}")
        
        # Update user information
        new_name = user_data.get('name', user_to_update['name'])
        new_email = user_data.get('email', user_to_update['email'])
        new_role = user_data.get('role', user_to_update['role'])
        new_avatar_url = user_data.get('avatarUrl', user_to_update['avatarUrl'])  # Preserve existing avatar if not provided
        
        # Check if email is already taken by another user
        if new_email != user_to_update['email']:
            cur.execute('SELECT id FROM "user" WHERE email = %s AND id != %s', (new_email, user_id))
            if cur.fetchone():
                raise HTTPException(status_code=400, detail="Email already exists")
        
        # Update user in users table
        cur.execute("""
            UPDATE "user" 
            SET name = %s, email = %s, role = %s, "avatarUrl" = %s, "updated_at" = NOW()
            WHERE id = %s
            RETURNING *
        """, (new_name, new_email, new_role, new_avatar_url, user_id))
        
        updated_user = cur.fetchone()
        
        # If role changed, update all project roles to match
        if new_role != user_to_update['role']:
            cur.execute("""
                UPDATE user_project 
                SET role = %s 
                WHERE user_id = %s
            """, (new_role, user_id))
            
            updated_projects = cur.rowcount
            print(f"DEBUG: Updated role in {updated_projects} projects")
        
        print(f"DEBUG: Successfully updated user {updated_user['email']}")
        
        conn.commit()
        
        return {
            "message": f"User {updated_user['email']} updated successfully",
            "user": {
                "id": updated_user['id'],
                "name": updated_user['name'],
                "email": updated_user['email'],
                "avatarUrl": updated_user['avatarUrl'],
                "role": updated_user['role'],
                "updated_at": updated_user['updated_at'].isoformat() if updated_user['updated_at'] else None
            }
        }
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        print(f"DEBUG: Error updating user: {str(e)}")
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# Comment endpoints
@app.post("/comments")
async def create_comment(comment_data: dict, current_user: dict = Depends(get_current_user)):
    """Create a new comment"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Insert the comment with UTC timestamp
        cur.execute("""
            INSERT INTO comment (body, "issueId", "userId", "created_at", "updated_at")
            VALUES (%s, %s, %s, NOW(), NOW())
            RETURNING id, body, "created_at", "updated_at"
        """, (
            comment_data['body'],
            comment_data['issueId'],
            current_user['id']
        ))
        
        comment = cur.fetchone()
        conn.commit()
        
        return {
            "comment": {
                "id": str(comment['id']),
                "body": comment['body'],
                "createdAt": comment['created_at'].isoformat(),
                "updatedAt": comment['updated_at'].isoformat(),
                "user": {
                    "id": current_user['id'],
                    "name": current_user['name'],
                    "email": current_user['email'],
                    "avatarUrl": current_user['avatarUrl']
                }
            }
        }
        
    except Exception as e:
        conn.rollback()
        print(f"Error creating comment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.put("/comments/{comment_id}")
async def update_comment(comment_id: int, comment_data: dict, current_user: dict = Depends(get_current_user)):
    """Update a comment"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if user owns the comment
        cur.execute("""
            SELECT "userId" FROM comment WHERE id = %s
        """, (comment_id,))
        comment_owner = cur.fetchone()
        
        if not comment_owner or comment_owner['userId'] != current_user['id']:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Update the comment
        cur.execute("""
            UPDATE comment 
            SET body = %s, "updated_at" = NOW()
            WHERE id = %s
            RETURNING id, body, "created_at", "updated_at"
        """, (comment_data['body'], comment_id))
        
        updated_comment = cur.fetchone()
        conn.commit()
        
        return {
            "comment": {
                "id": str(updated_comment['id']),
                "body": updated_comment['body'],
                "createdAt": updated_comment['created_at'].isoformat(),
                "updatedAt": updated_comment['updated_at'].isoformat(),
                "user": {
                    "id": current_user['id'],
                    "name": current_user['name'],
                    "email": current_user['email'],
                    "avatarUrl": current_user['avatarUrl']
                }
            }
        }
        
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        print(f"Error updating comment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.delete("/comments/{comment_id}")
async def delete_comment(comment_id: int, current_user: dict = Depends(get_current_user)):
    """Delete a comment"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if user owns the comment
        cur.execute("""
            SELECT "userId" FROM comment WHERE id = %s
        """, (comment_id,))
        comment_owner = cur.fetchone()
        
        if not comment_owner or comment_owner['userId'] != current_user['id']:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Delete the comment
        cur.execute("""
            DELETE FROM comment WHERE id = %s
        """, (comment_id,))
        
        conn.commit()
        return {"message": "Comment deleted successfully"}
        
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        print(f"Error deleting comment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# Create new project
@app.post("/projects")
async def create_project(project_data: dict, current_user: dict = Depends(get_current_user)):
    """Create a new project"""
    user_id = current_user['id']
    
    print(f"DEBUG: Creating project by user {current_user['email']}: {project_data}")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Create the project
        cur.execute("""
            INSERT INTO project (name, url, description, category, owner_id)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING *
        """, (
            project_data.get('name'),
            project_data.get('url', ''),
            project_data.get('description', ''),
            project_data.get('category', 'software'),
            user_id
        ))
        
        project = cur.fetchone()
        print(f"DEBUG: Created project with ID: {project['id']}")
        
        # Add creator as admin
        cur.execute("""
            INSERT INTO user_project (user_id, project_id, role)
            VALUES (%s, %s, %s)
        """, (user_id, project['id'], 'admin'))
        
        print(f"DEBUG: Added user {user_id} as admin to project {project['id']}")
        
        conn.commit()
        
        return {
            "project": {
                "id": project['id'],
                "name": project['name'],
                "url": project['url'],
                "description": project['description'],
                "category": project['category'],
                "createdAt": project['created_at'].isoformat() if project['created_at'] else None,
                "updated_at": project['updated_at'].isoformat() if project['updated_at'] else None,
                "userRole": 'admin'
            }
        }
    except Exception as e:
        print(f"DEBUG: Error creating project: {str(e)}")
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# Add user to project
@app.post("/projects/{project_id}/users")
async def add_user_to_project(project_id: int, user_data: dict, current_user: dict = Depends(get_current_user)):
    """Add a user to a project"""
    current_user_id = current_user['id']
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if current user is admin (global admin or project admin)
        cur.execute("""
            SELECT role FROM "user" WHERE id = %s
        """, (current_user_id,))
        global_user = cur.fetchone()
        
        cur.execute("""
            SELECT role FROM user_project 
            WHERE user_id = %s AND project_id = %s
        """, (current_user_id, project_id))
        
        project_user_role = cur.fetchone()
        
        is_global_admin = global_user and global_user['role'] == 'admin'
        is_project_admin = project_user_role and project_user_role['role'] == 'admin'
        
        if not (is_global_admin or is_project_admin):
            raise HTTPException(status_code=403, detail="Only admins can add users to projects")
        
        # Find user by email (user must already exist in the system)
        cur.execute("""
            SELECT id, role FROM "user" WHERE email = %s
        """, (user_data.get('email'),))
        
        user = cur.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found. Please create the user in Admin > Manage Users first.")
        
        # Check if user already in project
        cur.execute("""
            SELECT id FROM user_project 
            WHERE user_id = %s AND project_id = %s
        """, (user['id'], project_id))
        
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="User already in project")
        
        # Add user to project using their global role
        cur.execute("""
            INSERT INTO user_project (user_id, project_id, role)
            VALUES (%s, %s, %s)
        """, (user['id'], project_id, user['role']))
        
        conn.commit()
        
        return {"message": "User added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# Get project users
@app.get("/projects/{project_id}/users")
async def get_project_users(project_id: int, current_user: dict = Depends(get_current_user)):
    """Get all users in a project"""
    user_id = current_user['id']
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if user has access to project
        cur.execute("""
            SELECT role FROM user_project 
            WHERE user_id = %s AND project_id = %s
        """, (user_id, project_id))
        
        if not cur.fetchone():
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Get all users in project
        cur.execute("""
            SELECT u.*, up.role as project_role, up.joined_at
            FROM "user" u
            JOIN user_project up ON u.id = up.user_id
            WHERE up.project_id = %s
            ORDER BY up.joined_at
        """, (project_id,))
        
        users = cur.fetchall()
        
        return {
            "users": [
                {
                    "id": u['id'],
                    "name": u['name'],
                    "email": u['email'],
                    "avatarUrl": u['avatarUrl'],
                    "projectRole": u['project_role'],
                    "joinedAt": u['joined_at'].isoformat() if u['joined_at'] else None
                }
                for u in users
            ]
        }
    finally:
        cur.close()
        conn.close()

# Remove user from project
@app.delete("/projects/{project_id}/users/{user_id}")
async def remove_user_from_project(project_id: int, user_id: int, current_user: dict = Depends(get_current_user)):
    """Remove a user from a project"""
    current_user_id = current_user['id']
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if current user is admin (global admin or project admin)
        cur.execute("""
            SELECT role FROM "user" WHERE id = %s
        """, (current_user_id,))
        global_user = cur.fetchone()
        
        cur.execute("""
            SELECT role FROM user_project 
            WHERE user_id = %s AND project_id = %s
        """, (current_user_id, project_id))
        
        project_user_role = cur.fetchone()
        
        is_global_admin = global_user and global_user['role'] == 'admin'
        is_project_admin = project_user_role and project_user_role['role'] == 'admin'
        
        if not (is_global_admin or is_project_admin):
            raise HTTPException(status_code=403, detail="Only admins can remove users from projects")
        
        # Don't allow removing the owner
        cur.execute("""
            SELECT owner_id FROM project WHERE id = %s
        """, (project_id,))
        
        project = cur.fetchone()
        # Allow removing project owner only by admins (but not self-removal)
        if project['owner_id'] == user_id:
            if current_user['role'] != 'admin':
                raise HTTPException(status_code=403, detail="Only admins can remove project owner")
            # Don't allow owner to remove themselves
            cur.execute('SELECT id FROM "user" WHERE email = %s', (current_user['email'],))
            current_user_db = cur.fetchone()
            if current_user_db['id'] == user_id:
                raise HTTPException(status_code=400, detail="Project owner cannot remove themselves")
        
        # Remove user from project
        cur.execute("""
            DELETE FROM user_project 
            WHERE user_id = %s AND project_id = %s
        """, (user_id, project_id))
        
        conn.commit()
        
        return {"message": "User removed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# Update project
@app.put("/projects/{project_id}")
async def update_project(project_id: int, project_data: dict, current_user: dict = Depends(get_current_user)):
    """Update a project"""
    current_user_id = current_user['id']
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if current user has access to project
        cur.execute("""
            SELECT role FROM user_project 
            WHERE user_id = %s AND project_id = %s
        """, (current_user_id, project_id))
        
        user_access = cur.fetchone()
        if not user_access:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Update project
        cur.execute("""
            UPDATE project 
            SET name = %s, url = %s, description = %s, category = %s, "updated_at" = %s
            WHERE id = %s
            RETURNING *
        """, (
            project_data.get('name'),
            project_data.get('url', ''),
            project_data.get('description', ''),
            project_data.get('category', 'software'),
            datetime.now(),
            project_id
        ))
        
        updated_project = cur.fetchone()
        if not updated_project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        conn.commit()
        
        return {
            "project": {
                "id": updated_project['id'],
                "name": updated_project['name'],
                "url": updated_project['url'],
                "description": updated_project['description'],
                "category": updated_project['category'],
                "createdAt": updated_project['created_at'].isoformat() if updated_project['created_at'] else None,
                "updated_at": updated_project['updated_at'].isoformat() if updated_project['updated_at'] else None
            }
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@app.put("/projects/{project_id}/users/{user_id}/role", response_model=dict)
async def update_user_role(
    project_id: int, 
    user_id: int, 
    role_update: dict, 
    current_user: dict = Depends(get_current_user)
):
    print(f"DEBUG: Role update request - Project: {project_id}, User: {user_id}, New Role: {role_update.get('role')}")
    print(f"DEBUG: Current user: {current_user}")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if current user is global admin
        is_global_admin = current_user.get('role') == 'admin'
        
        # Check if current user is project admin
        cur.execute("""
            SELECT role FROM user_project 
            WHERE user_id = (SELECT id FROM "user" WHERE email = %s) 
            AND project_id = %s
        """, (current_user['email'], project_id))
        user_project = cur.fetchone()
        is_project_admin = user_project and user_project['role'] == 'admin'
        
        print(f"DEBUG: is_global_admin: {is_global_admin}, is_project_admin: {is_project_admin}")
        
        if not (is_global_admin or is_project_admin):
            raise HTTPException(status_code=403, detail="Only admins can update member roles")
        
        # Update the role
        new_role = role_update.get('role')
        if new_role not in ['admin', 'user', 'viewer']:
            raise HTTPException(status_code=400, detail="Invalid role. Must be 'admin', 'user', or 'viewer'")
        
        print(f"DEBUG: Updating user {user_id} in project {project_id} to role {new_role}")
        
        # Update project role
        cur.execute("""
            UPDATE user_project 
            SET role = %s 
            WHERE user_id = %s AND project_id = %s
            RETURNING *
        """, (new_role, user_id, project_id))
        
        updated_project = cur.fetchone()
        if not updated_project:
            raise HTTPException(status_code=404, detail="Member not found in project")
        
        # Also update global role to match project role
        cur.execute("""
            UPDATE "user" 
            SET role = %s 
            WHERE id = %s
            RETURNING *
        """, (new_role, user_id))
        
        updated_user = cur.fetchone()
        
        print(f"DEBUG: Successfully updated project role: {updated_project['role']}")
        print(f"DEBUG: Successfully updated global role: {updated_user['role']}")
        
        conn.commit()
        return {"message": "Role updated successfully", "role": updated_project['role']}
    
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        print(f"DEBUG: Error updating role: {str(e)}")
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)