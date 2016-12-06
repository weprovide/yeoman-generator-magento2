const helpers = require('yeoman-test')
const assert = require('yeoman-assert')
const path = require('path')

async function setup (optionOverrides = {}) {
  const options = Object.assign({
    vendorName: 'Example',
    moduleName: 'ExampleModule',
    email: 'example@example.com',
    name: 'Name Surname',
    description: 'Test description'
  }, optionOverrides)

  const dir = await helpers.run(path.join(__dirname, 'index')).withPrompts(options)

  return Object.assign({}, options, { dir })
}

test('Command can execute', async () => {
  await setup()
})

test('Composer.json created with correct settings', async () => {
  const {vendorName, moduleName, email, name} = await setup()

  assert.fileContent('composer.json', `"name": "${vendorName.toLowerCase()}/${moduleName.toLowerCase()}"`)
  assert.fileContent('composer.json', `"email": "${email}"`)
  assert.fileContent('composer.json', `"name": "${name}"`)
  assert.fileContent('composer.json', `"${vendorName}\\\\${moduleName}\\\\": ""`)
})

test('Registration.php created with correct settings', async () => {
  const {vendorName, moduleName} = await setup()
  const configName = `${vendorName}_${moduleName}`

  assert.fileContent('registration.php', `'${configName}',`)
})

test('etc/module.xml created with correct settings', async () => {
  const {vendorName, moduleName} = await setup()
  const configName = `${vendorName}_${moduleName}`

  assert.fileContent('etc/module.xml', `<module name="${configName}" setup_version="1.0.0" />`)
})

test('README.md created with correct settings', async () => {
  const {moduleName, description} = await setup()

  assert.fileContent('README.md', `# Magento2 Module ${moduleName}`)
  assert.fileContent('README.md', `${description}`)
})
