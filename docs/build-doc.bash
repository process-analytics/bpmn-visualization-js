#!/usr/bin/env bash
set -e

echo "Building bpmn-visualization-js html documentation with Docker"

doc_input="$(pwd)/docs"
doc_output="$(pwd)/docs-generated"
rm -rf ${doc_output}
mkdir -p ${doc_output}

# TODO: rm container if no error
docker run --rm -v "${doc_input}:/documents/" -v "${doc_output}:/documents-generated/" \
    --name bpmn-visu-js-asciidoc \
    asciidoctor/docker-asciidoctor:1.1.0 \
    asciidoctor -D /documents-generated index.adoc

# TODO use a more generic way
cp -R ${doc_input}/architecture/images ${doc_output}/images

echo "Documentation is now available in ${doc_output}"