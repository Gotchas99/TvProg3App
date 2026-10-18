define([], function () {
  class Announcer {
    constructor() {
      this._subscriptions = []; // no class fields on Chrome 56
    }

    when(eventClass, fn, owner) {
      this._subscriptions.push({
        eventClass: eventClass,
        fn: fn,
        owner: owner
      });
      return this;
    }

    announce(announcement) {
      this._subscriptions.slice().forEach(function (s) {
        if (announcement instanceof s.eventClass)
          // hierarchy matching!
          try {
            s.fn(announcement);
          } catch (e) {
            console.error("Subscriber failed:", e);
          }
      });
      return announcement;
    }

    unsubscribe(owner) {
      this._subscriptions = this._subscriptions.filter(function (s) {
        return s.owner !== owner;
      });
    }
  }

  class Announcement {}

  return {Announcer: Announcer, Announcement: Announcement};
});
