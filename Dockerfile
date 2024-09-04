################################################################################

FROM golang:latest AS fetch-stage
COPY go.mod go.sum /app
WORKDIR /app
RUN go mod download

################################################################################

FROM ghcr.io/a-h/templ:latest AS generate-stage
COPY --chown=65532:65532 . /app
WORKDIR /app
RUN ["templ", "generate"]

################################################################################

FROM golang:1.23 AS build-stage
COPY --from=generate-stage /app /app
WORKDIR /app
RUN CGO_ENABLED=0 go build -o /bin/m4xdev ./cmd/m4xdev

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
# See https:   //docs.docker.com/develop/develop-images/dockerfile_best-practices/#user
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
COPY --from=build-stage /bin/m4xdev /bin/
# Copy the static assets
COPY --from=build-stage /src/wwwroot /wwwroot

EXPOSE 3002
ENTRYPOINT [ "/bin/m4xdev" ]
