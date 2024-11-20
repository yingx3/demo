import request from './request'

export const getMarksJson = query => {
  return request('/common/loadJson', 'get', query)
}
