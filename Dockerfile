# syntax=docker/dockerfile:1

################################################################################
FROM golang:1.21.5 AS build
WORKDIR /src

COPY . .

# Install templ transpiler
RUN --mount=type=cache,target=/go/bin/ \
    go install github.com/a-h/templ/cmd/templ@latest
# Transpile the *.templ files into *_templ.go
RUN --mount=type=cache,target=/go/bin/ \
    templ generate

# Download Go module depenencies
RUN --mount=type=cache,target=/go/pkg/mod/ \
    go mod download -x
# Build the application.
RUN --mount=type=cache,target=/go/pkg/mod/ \
    CGO_ENABLED=0 go build -o /bin/m4xdev ./cmd/m4xdev

################################################################################
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
COPY --from=build /bin/m4xdev /bin/
# Copy the static assets
COPY --from=build /src/wwwroot /wwwroot

EXPOSE 3002
ENTRYPOINT [ "/bin/m4xdev" ]
