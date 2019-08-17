const fs = require('fs')

function genClass(className, classDesc) {
  function extendsDesc() {
    if (classDesc.extends) return `extends ${classDesc.extends} `
    return ''
  }

  function constructorDesc() {
    if (classDesc.hasConstructor) {
      return `  constructor() {
    ${classDesc.extends ? 'super()' : ''}
    console.error("UNIMPLEMENTED: new ${className}()", [...arguments])
  }`
  }
    return ''
  }

  function methodsDesc() {
    function methodDesc(methodName) {
      return `  ${methodName}() {
    console.error("UNIMPLEMENTED: ${className}.${methodName}()", [...arguments])
  }`
    }
    return (classDesc.methods || [])
      .reduce((acc, val) => acc.concat(methodDesc(val)), [])
      .join('\n')
  }

  function getterDesc(propertyName) {
    return `  get ${propertyName}() {
    console.error("UNIMPLEMENTED: get ${className}.${propertyName}", [...arguments])
  }`
  }

  function setterDesc(propertyName) {
    return `  set ${propertyName}(val) {
    console.error("UNIMPLEMENTED: set ${className}.${propertyName}", [...arguments])
  }`
  }

  function readonlyPropertiesDesc() {
    return (classDesc.readonlyProperties || [])
      .reduce((acc, val) => acc.concat(getterDesc(val)), [])
      .join('\n')
  }

  function propertiesDesc() {
    return (classDesc.properties || [])
      .reduce((acc, val) => acc.concat(getterDesc(val)).concat(setterDesc(val)), [])
      .join('\n')
  }

  function eventHandlersDesc() {
    return (classDesc.events || [])
      .reduce((acc, val) => {
        let handlerName = `on${val}`
        return acc.concat(getterDesc(handlerName)).concat(setterDesc(handlerName))
      }, [])
      .join('\n')
  }

  return `export class ${className} ${extendsDesc()}{
${constructorDesc()}
${methodsDesc()}
${readonlyPropertiesDesc()}
${propertiesDesc()}
${eventHandlersDesc()}
}
`
}

const desc = JSON.parse(fs.readFileSync('./webapi.json'))

let res = []
for (let className in desc) {
  res = res.concat(genClass(className, desc[className]))
  // fs.writeFileSync(`output/${className}.js`, genClass(className, desc[className]))
}
fs.writeFileSync('output/webapi.js', res.join('\n'))