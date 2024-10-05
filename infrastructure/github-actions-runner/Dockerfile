# Ubuntu base image
FROM ubuntu:latest

# Dependencies
RUN apt-get update && apt-get install -y \
    curl \
    tar \
    git \
    sudo \
    jq \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3 \
    python3-pip \
    ca-certificates \ 
    libicu-dev \
    systemctl

# Create a user for the runner
RUN useradd -m github-runner && echo "github-runner ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Switch to the runner user
USER github-runner
RUN sudo apt-get update && sudo apt-get install

# ENV NVM_VERSION=v0.39.3
ENV NVM_DIR=/home/github-runner/.nvm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.39.3/install.sh | bash \ 
    && sudo bash -c "source $HOME/.bashrc" 
ENV PATH=$NVM_DIR:$PATH
RUN sudo bash -c "chmod +x ${NVM_DIR}/nvm.sh"
RUN sudo bash -c "${NVM_DIR}/nvm.sh install v20.17.0"

WORKDIR /home/github-runner/actions-runner

# Download and install the GitHub Actions runner
RUN curl -o actions-runner-linux-x64-2.319.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.319.1/actions-runner-linux-x64-2.319.1.tar.gz \
    && tar xzf ./actions-runner-linux-x64-2.319.1.tar.gz \
    && rm actions-runner-linux-x64-2.319.1.tar.gz

RUN sudo ./bin/installdependencies.sh

# Add the runner startup script
COPY entrypoint.sh /home/github-runner/entrypoint.sh
RUN sudo chmod +x /home/github-runner/entrypoint.sh

# Start the entrypoint script
ENTRYPOINT ["/home/github-runner/entrypoint.sh"]
