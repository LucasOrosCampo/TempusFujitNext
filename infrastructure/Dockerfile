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
    libicu-dev

# Create a user for the runner
RUN useradd -m github-runner && echo "github-runner ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Switch to the runner user
USER github-runner
WORKDIR /home/github-runner

# Download and install the GitHub Actions runner
RUN curl -o actions-runner-linux-x64-2.319.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.319.1/actions-runner-linux-x64-2.319.1.tar.gz \
    && tar xzf ./actions-runner-linux-x64-2.319.1.tar.gz \
    && rm actions-runner-linux-x64-2.319.1.tar.gz



# Add the runner startup script
COPY entrypoint.sh /home/github-runner/entrypoint.sh
RUN sudo chmod +x /home/github-runner/entrypoint.sh

# Start the entrypoint script
ENTRYPOINT ["/home/github-runner/entrypoint.sh"]
