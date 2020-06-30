#!/usr/bin/env bash
set -e

echo "Building bpmn-visualization html documentation with Docker"

doc_input="$(pwd)/docs"
doc_output="$(pwd)/build/docs"
rm -rf ${doc_output}
mkdir -p ${doc_output}

docker run --rm -v "${doc_input}:/documents/" -v "${doc_output}:/documents-generated/" \
    --name bpmn-visualization-asciidoc \
    asciidoctor/docker-asciidoctor:1.1.0 \
    asciidoctor -D /documents-generated index.adoc

cp -R ${doc_input}/architecture/images ${doc_output}/images

echo "Documentation is now available in ${doc_output}"
