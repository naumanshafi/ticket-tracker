import moment from 'moment';
import 'moment-timezone';

export const formatDate = (date, format = 'MMMM D, YYYY') =>
  date ? moment(date).format(format) : date;

export const formatDateTime = (date, format = 'MMMM D, YYYY, h:mm A') =>
  date ? moment(date).format(format) : date;

export const formatDateTimeForAPI = date =>
  date
    ? moment(date)
        .utc()
        .format()
    : date;

export const formatDateTimeConversational = date => (date ? moment(date).fromNow() : date);

export const formatDateTimePST = date => 
  date ? moment.utc(date).tz('America/Los_Angeles').format('h:mm A [PST]') : date;

export const formatDateTimeFullPST = date => 
  date ? moment.utc(date).tz('America/Los_Angeles').format('h:mm A [PST]') + '\n' + moment.utc(date).tz('America/Los_Angeles').format('dddd, MMMM D, YYYY') : date;
