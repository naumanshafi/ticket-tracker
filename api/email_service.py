import httpx
import asyncio
from typing import List, Dict, Optional
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self, api_url: str = "http://localhost:3003/api/v1/mail", bearer_token: str = None):
        self.api_url = api_url
        self.bearer_token = bearer_token
        self.headers = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-US,en",
            "Content-Type": "application/json",
            "api-key": bearer_token if bearer_token else ""
        }
    
    async def send_template_email(
        self, 
        template_id: int,
        receivers: List[Dict[str, str]],  # [{"email": "user@example.com"}]
        replacements: List[Dict[str, any]],  # [{"key": "value"}]
        sender: Dict[str, str] = None
    ) -> bool:
        """Send email using template"""
        try:
            if not sender:
                sender = {
                    "email": "noman.s@turing.com",
                    "name": "Noman Shafi"
                }
            
            payload = {
                "receivers": receivers,
                "replacements": replacements,
                "sender": sender,
                "template_id": template_id,
                "project_id": 5417,  # From your working request
                "force_choose": "-1",
                "isMicrosoft": False,
                "allow_duplicates": False,
                "disable_throttling": True,
                "disableOpenTracking": False,
                "disableClickTracking": False
            }
            
            print(f"🔍 DEBUG: Sending email payload:")
            print(f"   Template ID: {payload['template_id']}")
            print(f"   Receivers: {payload['receivers']}")
            print(f"   Replacements: {payload['replacements']}")
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}/send-saved-template",
                    json=payload,
                    headers=self.headers,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    logger.info(f"Email sent successfully to {len(receivers)} recipients")
                    return True
                else:
                    logger.error(f"Failed to send email: {response.status_code} - {response.text}")
                    return False
                    
        except Exception as e:
            logger.error(f"Email service error: {str(e)}")
            return False

    async def send_ticket_assigned_email(
        self,
        assignee_email: str,
        assignee_name: str,
        ticket_id: int,
        ticket_title: str,
        ticket_description: str,
        ticket_type: str,
        priority: str,
        project_name: str,
        reporter_name: str,
        reporter_email: str,
        ticket_url: str,
        unsubscribe_url: str = None,
        template_id: int = 10619  # Template ID for ticket assignment
    ) -> bool:
        """Send ticket assignment notification"""
        
        receivers = [{"email": assignee_email, "name": assignee_name}]
        replacements = [{
            "senderVariant": "1",
            "assigneeName": assignee_name,
            "ticketId": str(ticket_id),
            "ticketTitle": ticket_title,
            "ticketDescription": ticket_description,
            "ticketType": ticket_type,
            "priority": priority,
            "projectName": project_name,
            "reporterName": reporter_name,
            "reporterEmail": reporter_email,
            "ticketUrl": ticket_url,
            "unsubscribeUrl": unsubscribe_url or f"{ticket_url}/unsubscribe"
        }]
        
        return await self.send_template_email(template_id, receivers, replacements)

    async def send_ticket_status_changed_email(
        self,
        user_emails: List[str],  # Reporter and assignee emails
        user_names: List[str],   # Corresponding names
        ticket_id: int,
        ticket_title: str,
        old_status: str,
        new_status: str,
        project_name: str,
        updated_by_name: str,
        ticket_url: str,
        unsubscribe_url: str = None,
        template_id: int = 10620  # Template ID for status change
    ) -> bool:
        """Send ticket status change notification"""
        
        receivers = [{"email": email, "name": name} for email, name in zip(user_emails, user_names)]
        replacements = []
        
        # Create a single replacement object for all variables
        replacement_data = {
            "senderVariant": "1",
            "userName": user_names[0] if user_names else "User",
            "ticketId": str(ticket_id),
            "ticketTitle": ticket_title,
            "oldStatus": old_status,
            "newStatus": new_status,
            "projectName": project_name,
            "updatedByName": updated_by_name,
            "ticketUrl": ticket_url,
            "unsubscribeUrl": unsubscribe_url or f"{ticket_url}/unsubscribe"
        }
        replacements = [replacement_data]
        
        print(f"📧 DEBUG: Sending status change email with {len(replacements)} replacements")
        print(f"📋 DEBUG: First replacement: {replacements[0] if replacements else 'None'}")
        
        return await self.send_template_email(template_id, receivers, replacements)

    async def send_assignee_changed_email(
        self,
        notification_emails: List[str],  # Old assignee, new assignee, reporter
        notification_names: List[str],   # Corresponding names
        ticket_id: int,
        ticket_title: str,
        old_assignee_name: str,
        old_assignee_email: str,
        new_assignee_name: str,
        new_assignee_email: str,
        changed_by_name: str,
        project_name: str,
        priority: str,
        ticket_type: str,
        ticket_url: str,
        template_id: int = 10621  # Template ID for assignee change
    ) -> bool:
        """Send assignee change notification"""
        
        receivers = [{"email": email} for email in notification_emails]
        replacements = []
        
        for user_name in notification_names:
            replacements.append({
                "userName": user_name,
                "ticketId": ticket_id,
                "ticketTitle": ticket_title,
                "oldAssigneeName": old_assignee_name,
                "oldAssigneeEmail": old_assignee_email,
                "newAssigneeName": new_assignee_name,
                "newAssigneeEmail": new_assignee_email,
                "changedByName": changed_by_name,
                "projectName": project_name,
                "priority": priority,
                "ticketType": ticket_type,
                "ticketUrl": ticket_url,
                "unsubscribeUrl": unsubscribe_url or f"{ticket_url}/unsubscribe"
            })
        
        return await self.send_template_email(template_id, receivers, replacements)

    async def send_comment_added_email(
        self,
        notification_emails: List[str],
        notification_names: List[str],
        ticket_id: int,
        ticket_title: str,
        commenter_name: str,
        commenter_initials: str,
        comment_content: str,
        comment_time: str,
        project_name: str,
        ticket_status: str,
        ticket_url: str,
        template_id: int = 10622  # Template ID for comments
    ) -> bool:
        """Send comment notification"""
        
        receivers = [{"email": email} for email in notification_emails]
        replacements = []
        
        for user_name in notification_names:
            replacements.append({
                "userName": user_name,
                "ticketId": ticket_id,
                "ticketTitle": ticket_title,
                "commenterName": commenter_name,
                "commenterInitials": commenter_initials,
                "commentContent": comment_content,
                "commentTime": comment_time,
                "projectName": project_name,
                "ticketStatus": ticket_status,
                "ticketUrl": ticket_url,
                "unsubscribeUrl": unsubscribe_url or f"{ticket_url}/unsubscribe"
            })
        
        return await self.send_template_email(template_id, receivers, replacements)

# Utility functions
def get_user_initials(name: str) -> str:
    """Get user initials from full name"""
    if not name:
        return "U"
    parts = name.split()
    if len(parts) == 1:
        return parts[0][0].upper()
    return (parts[0][0] + parts[-1][0]).upper()

def format_priority(priority: str) -> str:
    """Format priority for display"""
    priority_map = {
        "1": "🔴 Highest",
        "2": "🟠 High", 
        "3": "🟡 Medium",
        "4": "🔵 Low",
        "5": "⚪ Lowest"
    }
    return priority_map.get(priority, priority)

def format_status(status: str) -> str:
    """Format status for display"""
    status_map = {
        "backlog": "📋 Backlog",
        "selected": "🎯 Selected",
        "inprogress": "⚡ In Progress", 
        "underreview": "👀 Under Review",
        "done": "✅ Done"
    }
    return status_map.get(status, status.title())

# Initialize email service with environment variables
import os
from dotenv import load_dotenv

load_dotenv()

email_service = EmailService(
    api_url=os.getenv('EMAIL_API_URL', 'https://email-mailer.turing.com/api/v1/mail'),
    bearer_token=os.getenv('EMAIL_BEARER_TOKEN')
)
