const photoTransformer = (path) => {
    return process.env.API_URL + '/uploads/' + path
}

module.exports = {
    photoTransformer
}