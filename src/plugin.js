const { mkdtemp } = require('node:fs/promises')
const { tmpdir } = require('node:os')
const { join } = require('node:path')
const { promisify } = require('node:util')
const ChildProcess = require('node:child_process')

const execFile = promisify(ChildProcess.execFile)

export default class TesseractPlugin {

  constructor(options, context) {
    this.options = Object.assign({}, TesseractPlugin.defaults, options)
    this.context = context
  }

  async extract({ buffer, ...raw }) {
    let tmp = await mkdtemp(join(tmpdir(), 'tropy-tesseract-'))
    let tmpFile = join(tmp, this.options.tmpFileName)

    await this.context.sharp.toFile(tmpFile, buffer, { raw })
    this.context.logger.info(`saved buffer to ${tmpFile} for extraction`)

    let tesseract = this.options.binary
    let { stdout, stderr } = await execFile(tesseract, [tmpFile, '-'])

    if (stderr)
      this.context.logger.warn(`tesseract: ${stderr.trimEnd()}`)

    this.context.logger.info(`tesseract: ${stdout?.trimEnd()}`)

    if (stdout)
      return {
        note: stdout.trimEnd()
      }
  }
}

TesseractPlugin.defaults = {
  language: 'eng',
  tmpFileName: 'tmp.png'
}
