# Documentation guidelines
Below guidance should serve to write the properly distributed documentation and to avoid any duplications.

Projects documentation consists of:
- HTML documentation - everything under the [/docs/users](../users) folder, with AsciiDoctor sources
    - High level information
    - Contextual content
    - BPMN support details
    - Architecture overview
    
- Markdown documentation for Developers / Integrators - all .md files in project root and under [/docs/contributors](../contributors) folder
    - Development guidance
    - How tos
    - Detailed usage

⚠️ _IMPORTANT TO NOTE_ \
The root README file content should not be overwhelming and supposed to contain only basic information:
 - Project introduction
 - Basic usage
 - Links to examples and developers or html documentation for more details


## Building the HTML documentation

**DISCLAIMER**:
The documentation sources are in the AsciiDoctor format. 
Depending on the rendering engine, the display may not work completely (font-awesome icons and some links). 
This is the case when viewing directly on GitHub Web.

- From the root folder of the repository, run 
```bash
npm run docs
```

The documentation is accessible in the `build/docs` folder.
