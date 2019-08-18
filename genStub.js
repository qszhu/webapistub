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

  function staticMethodsDesc() {
    function staticMethodDesc(methodName) {
      return `  static ${methodName}() {
    console.error("UNIMPLEMENTED: ${className}.${methodName}()", [...arguments])
  }`
    }
    return (classDesc.staticMethods || [])
      .reduce((acc, val) => acc.concat(staticMethodDesc(val)), [])
      .join('\n')
  }

  function methodsDesc() {
    function methodDesc(methodName) {
      return `  ${methodName}() {
    console.error("UNIMPLEMENTED: ${className}#${methodName}()", [...arguments])
  }`
    }
    return (classDesc.methods || [])
      .reduce((acc, val) => acc.concat(methodDesc(val)), [])
      .join('\n')
  }

  function getterDesc(propertyName) {
    return `  get ${propertyName}() {
    console.error("UNIMPLEMENTED: get ${className}#${propertyName}", [...arguments])
  }`
  }

  function setterDesc(propertyName) {
    return `  set ${propertyName}(val) {
    console.error("UNIMPLEMENTED: set ${className}#${propertyName}", [...arguments])
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

  function importDesc() {
    if (classDesc.extends) {
      return `import ${classDesc.extends} from './${classDesc.extends}'`
    }
    return ''
  }

  return `${importDesc()}

export default class ${className} ${extendsDesc()}{
${constructorDesc()}
${staticMethodsDesc()}
${methodsDesc()}
${readonlyPropertiesDesc()}
${propertiesDesc()}
${eventHandlersDesc()}
}
`
}

const desc = JSON.parse(fs.readFileSync('./webapi.json'))

for (let className in desc) {
  fs.writeFileSync(`output/${className}.js`, genClass(className, desc[className]))
}