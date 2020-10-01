FROM gitpod/workspace-full

RUN sudo apt-get update && \
    sudo apt-get install -y \
        chromium \
        nss \
        freetype \
        freetype-dev \
        harfbuzz \
        ca-certificates \
        ttf-freefont \
        nodejs \
        yarn && \
    sudo rm -rf /var/lib/apt/lists/*
