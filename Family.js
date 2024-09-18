class FamilyWallClient {
  constructor(data) {
    this.data = data;
  }

  // Access members data from a00
  getMembers() {
    return this.data.a00.r.r.members.map((member) =>
      this._getMemberDetails(member)
    );
  }

  // Access a specific member by first name from a00
  getMember(firstName) {
    const member = this.data.a00.r.r.members.find(
      (member) => member.firstName === firstName
    );
    return member ? this._getMemberDetails(member) : null;
  }

  // Access member profiles from a01 (more detailed profile information)
  getMemberProfile(accountId) {
    const profile = this.data.a01?.r?.r[accountId];
    return profile ? this._getProfileDetails(profile) : null;
  }

  // Get the overall family settings from a03
  getFamilySettings() {
    const settings = this.data.a03?.r?.r;
    return settings
      ? {
          familyId: settings.familyId,
          reminderValue: settings.defaultReminderValue,
          geolocSharing: settings.geolocSharing,
          calendarFirstDayOfWeek: settings.calendarFirstDayOfWeek,
        }
      : null;
  }

  // Get family media from a00
  getFamilyMedia() {
    return this.data.a00.r.r.coverMedias.map((media) => ({
      pictureUrl: media.pictureUrl,
      resolution: `${media.resolutionX}x${media.resolutionY}`,
      creationDate: media.creationDate,
      mimeType: media.mimeType,
    }));
  }

  // Get the messaging data from a05
  getMessages() {
    return this.data.a05?.r?.r.map((thread) => ({
      threadId: thread.metaId,
      participants: thread.participants.map((participant) => ({
        accountId: participant.accountId,
        firstName: participant.accountFirstname,
        lastReadMessageDate: participant.lastReadMessageDate,
      })),
      unreadCount: thread.unreadCount,
      messageCount: thread.messageCount,
    }));
  }

  // Get premium account details from a06
  getPremiumAccountDetails() {
    const premium = this.data.a06?.r?.r.premium;
    return premium
      ? {
          premiumMember: premium.fWPremiumMemberSubscriber,
          familyQuota: premium.familyQuota,
          premiumFeatures: {
            geoFencing: premium.geoFencingActivated,
            audioAvailable: premium.audio,
            videoAvailable: premium.videoAvailable,
          },
        }
      : null;
  }

  // Private function to structure member details
  _getMemberDetails(member) {
    return {
      firstName: member.firstName,
      email: member.identifiers.find((id) => id.type === "Email")?.value,
      role: member.role,
      lastLoginDate: member.lastLoginDate,
      joinDate: member.joinDate,
      profileFamilyId: member.profileFamilyId,
      pictureURI: member.pictureURI,
      timeZone: member.timeZone,
      right: member.right,
      devices: this._getMemberDevices(member),
      identifiers: this._getMemberIdentifiers(member),
      medias: this._getMemberMedias(member),
      rights: {
        canUpdate: member.rights?.canUpdate || false,
        canDelete: member.rights?.canDelete || false,
      },
    };
  }

  // Private helper for devices
  _getMemberDevices(member) {
    return member.devices.map((device) => ({
      deviceType: device.deviceType,
      deviceId: device.deviceId,
      value: device.value,
    }));
  }

  // Private helper for identifiers
  _getMemberIdentifiers(member) {
    return member.identifiers.map((identifier) => ({
      type: identifier.type,
      value: identifier.value,
      validated: identifier.validated === "true",
    }));
  }

  // Private helper for media
  _getMemberMedias(member) {
    return member.medias.map((media) => ({
      pictureUrl: media.pictureUrl,
      canUpdate: media.rights?.canUpdate || false,
      canDelete: media.rights?.canDelete || false,
    }));
  }

  // Private helper to get profile details from a01
  _getProfileDetails(profile) {
    return {
      firstName: profile.firstName,
      email: profile.devices?.[0]?.value,
      timeZone: profile.timeZone,
      accountId: profile.accountId,
      pictureURI: profile.pictureURI,
      medias: this._getProfileMedias(profile.medias),
    };
  }

  // Helper to get profile media from a01
  _getProfileMedias(medias) {
    return medias.map((media) => ({
      pictureUrl: media.pictureUrl,
      canUpdate: media.rights?.canUpdate || false,
      canDelete: media.rights?.canDelete || false,
    }));
  }
}

// Export the FamilyWallClient class as a module
export default FamilyWallClient;
