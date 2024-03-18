# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

################################################################################
# Create a stage for building the application.
FROM golang:1.21.5 AS build
WORKDIR /src

COPY . .

# Install templ -> go transpiler
RUN --mount=type=cache,target=/go/bin \
    go install github.com/a-h/templ/cmd/templ@latest
# Transpile the *.templ files into *_templ.go
RUN --mount=type=cache,target=/go/bin \
    templ generate

# Download GO module depenencies
RUN --mount=type=cache,target=/go/pkg/mod/ \
    go mod download -x
# Build the application.
RUN --mount=type=cache,target=/go/pkg/mod/ \
    CGO_ENABLED=0 go build -o /bin/m4xdev ./cmd/m4xdev

################################################################################
# Create a new stage for running the application that contains the minimal
# runtime dependencies for the application. This often uses a different base
# image from the build stage where the necessary files are copied from the build
# stage.
#
# The example below uses the alpine image as the foundation for running the app.
# By specifying the "latest" tag, it will also use whatever happens to be the
# most recent version of that image when you build your Dockerfile. If
# reproducability is important, consider using a versioned tag
# (e.g., alpine:3.17.2) or SHA (e.g., alpine:sha256:c41ab5c992deb4fe7e5da09f67a8804a46bd0592bfdf0b1847dde0e0889d2bff).
FROM alpine:latest AS final

# Install any runtime dependencies that are needed to run your application.
# Leverage a cache mount to /var/cache/apk/ to speed up subsequent builds.
RUN --mount=type=cache,target=/var/cache/apk \
    apk --update add \
        ca-certificates \
        tzdata \
        && \
        update-ca-certificates

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    m4xdev

USER m4xdev

# Copy the executable from the "build" stage.
COPY --from=build /bin/m4xdev /app/
# Copy the static assets
COPY --from=build /src/wwwroot /app/wwwroot

# Expose the port that the application listens on.
EXPOSE 3002

# What the container should run when it is started.
ENTRYPOINT [ "/app/m4xdev" ]
