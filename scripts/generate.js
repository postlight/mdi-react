const fs = require('fs');
const pathRegex = /\sd="(.*)"/;

const svgFiles = fs.readdirSync(`${__dirname}/../mdi/svg`);
let listOfComponents = [];
for (let svgFile of svgFiles) {
  const name = svgFile.split(/-/g).map(part => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join('').slice(0, -4);

  const content = fs.readFileSync(`${__dirname}/../mdi/svg/${svgFile}`);
  const pathMatches = pathRegex.exec(content);
  const path = pathMatches && pathMatches[1];
  // Skip on empty path
  if (!path) continue;

  const component = {
    name: name + 'Icon',
    fileName: name + 'Icon.js'
  };
  listOfComponents.push(component);

  const fileContent =
`import React from 'react';

const ${component.name} = ({ width = 24, height = 24, viewBox = '0 0 24 24', className, children, ...props }) => {
  let classes = 'mdi-icon';
  if (className) classes += \` \${className}\`;

  return (
    <svg {...props} width={width} height={height} viewBox={viewBox} className={classes}>
      <path d="${path}" />
    </svg>
  );
};

export default ${component.name};
`;

  fs.writeFileSync(`${__dirname}/../build/${component.fileName}`, fileContent);
}

const indexFileContent = listOfComponents
  .map(
    component => `export { default as ${component.name} } from './${component.fileName}';`
  )
  .join('\n');
fs.writeFileSync(`${__dirname}/../build/index.js`, indexFileContent);
