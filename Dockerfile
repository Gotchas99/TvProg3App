FROM debian:buster-slim

ENV DEBIAN_FRONTEND=noninteractive

# Point apt to the January 2020 Debian snapshot repository (Chromium 79 release window)
RUN echo "deb [check-valid-until=no] http://snapshot.debian.org/archive/debian/20200115T000000Z/ buster main" > /etc/apt/sources.list && \
    echo "deb [check-valid-until=no] http://snapshot.debian.org/archive/debian-security/20200115T000000Z/ buster/updates main" >> /etc/apt/sources.list

RUN apt-get -o Acquire::Check-Valid-Until=false update && \
    apt-get install -y --no-install-recommends \
    chromium=79.0.3945.130-1~deb10u1 \
    chromium-common=79.0.3945.130-1~deb10u1 \
    libgl1-mesa-dri \
    fonts-liberation \
    x11-apps \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1000 chromeuser
USER chromeuser

ENTRYPOINT ["chromium"]