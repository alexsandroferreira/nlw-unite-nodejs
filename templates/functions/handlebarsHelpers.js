module.exports = function (Handlebars) {
  Handlebars.registerHelper('startsWith', function (str, prefixes, options) {
    const prefixList = prefixes.split(',').map((p) => p.trim())
    return prefixList.some((prefix) => str.startsWith(prefix))
      ? options.fn(this)
      : options.inverse(this)
  })

  Handlebars.registerHelper('features', function (commits, options) {
    return commits
      .filter((commit) =>
        Handlebars.helpers.startsWith(commit.message, 'feat:, feat(', options),
      )
      .map((commit) => options.fn(commit))
      .join('')
  })

  Handlebars.registerHelper('fix', function (commits, options) {
    return commits
      .filter((commit) =>
        Handlebars.helpers.startsWith(commit.message, 'fix:, fix(', options),
      )
      .map((commit) => options.fn(commit))
      .join('')
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Handlebars.registerHelper('contributors', function (commits, options) {
    const contributors = {}

    commits.forEach((commit) => {
      const author = commit.author || 'Unknown'
      const authorUrl = commit.authorUrl || '#'
      const avatar = commit.avatar || 'https://via.placeholder.com/18'

      if (!contributors[author]) {
        contributors[author] = {
          avatar,
          authorUrl,
          commits: [],
        }
      }

      contributors[author].commits.push({
        hash: commit.shorthash,
        href: commit.href,
        message: commit.subject,
      })
    })

    let result = '### Contributors to this release\n'

    for (const [author, data] of Object.entries(contributors)) {
      result += `- <img src="${data.avatar}" alt="avatar" width="18"/> [${author}](${data.authorUrl}) +${data.commits.length}\n`
    }

    return result
  })

  Handlebars.registerHelper(
    'renderTitleIfValid',
    function (commits, prefixes, title, options) {
      const prefixList = prefixes.split(',').map((p) => p.trim())
      let isValid = false

      commits.forEach((commit) => {
        if (prefixList.some((prefix) => commit.message.startsWith(prefix))) {
          isValid = true
        }
      })

      if (isValid) {
        return `### ${title}\n${options.fn(this)}`
      }

      return ''
    },
  )
}
