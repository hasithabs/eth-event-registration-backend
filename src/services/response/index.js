export const success = (res, message = 'Success.', status = 200) => (content) => {
  if (content) {
    res.status(status).json({status, message, content})
  }
  return null
}

export const notFound = (res) => (content) => {
  if (content) {
    return content
  }
  res.status(404).end()
  return null
}

export const toPromise = (promise) => {
  return promise.then(data => {
    return [null, data]
  })
  .catch(err => [err])
}

export const authorOrAdmin = (res, user, userField) => (entity) => {
  if (entity) {
    const isAdmin = user.role === 'admin'
    const isAuthor = entity[userField] && entity[userField].equals(user.id)
    if (isAuthor || isAdmin) {
      return entity
    }
    res.status(401).end()
  }
  return null
}
