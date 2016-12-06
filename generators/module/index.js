const generators = require('yeoman-generator')
const yosay = require('yosay')
const path = require('path')
const fs = require('fs')

module.exports = class extends generators.Base {
  constructor (a,b) {
    super(a,b)

    this._getVendorName = this._getVendorName.bind(this)
    this._getModuleName = this._getModuleName.bind(this)
    this._isModule = this._isModule.bind(this)

    this.log(yosay('YO! Welcome to the Magento2 Generator'))
  }
  _getVendorName () {
    const destPath = this.destinationRoot()

    if(this.props && this.props.vendorName) {
      this.vendorName = this.props.vendorName
      return this.vendorName
    }

    if(this.vendorName) {
      return this.vendorName
    }

    this.vendorName = path.relative(`${destPath}/../../`, `${destPath}/../`)
    return this.vendorName
  }

  _getModuleName () {
    const destPath = this.destinationRoot()

    if(this.props && this.props.moduleName) {
      this.moduleName = this.props.moduleName
      return this.moduleName
    }

    if(this.moduleName) {
      return this.moduleName
    }

    this.moduleName = path.relative(`${destPath}/../`, `${destPath}`)
    return this.moduleName
  }

  _isModule () {
    const destPath = this.destinationRoot()

    return fs.existsSync(`${destPath}/registration.php`)
  }

  prompting () {
    return new Promise(resolve => {
      const isNotModule = !this._isModule()
      this.prompt([{
        type    : 'input',
        name    : 'vendorName',
        message : 'Your vendor prefix',
        store: false,
        default: this._getVendorName
      }, {
        type    : 'input',
        name    : 'moduleName',
        message : 'Module name',
        store: false,
        default: this._getModuleName
      }, {
        type    : 'input',
        name    : 'description',
        message : 'Module description',
        store: false
      }, {
        type    : 'input',
        name    : 'email',
        message : 'Author email',
        store: false
      }, {
        type    : 'input',
        name    : 'name',
        message : 'Author name',
        store: false
      }]).then(answers => {
        this.props = answers
        resolve()
      })
    })
  }

  get writing () {
    return {
      config () {
        const { name, email, description } = this.props
        const vendorName = this._getVendorName()
        const moduleName = this._getModuleName()
        const modulePath = `${vendorName}/${moduleName}`
        const configName = `${vendorName}_${moduleName}`

        this.destinationRoot(modulePath)

        this.fs.copyTpl(
          this.templatePath('composer.json'),
          this.destinationPath('composer.json'),
          { vendorName, moduleName, name, email }
        )

        this.fs.copyTpl(
          this.templatePath('registration.php'),
          this.destinationPath('registration.php'),
          { configName }
        )

        this.fs.copyTpl(
          this.templatePath('etc/module.xml'),
          this.destinationPath('etc/module.xml'),
          { configName }
        )

        this.fs.copyTpl(
          this.templatePath('README.md'),
          this.destinationPath('README.md'),
          { moduleName, description }
        )
      }
    }
  }
}
