/* Thunderbird IMAP UID 0 cannot identify a saved message. */
var MdhrSendCompatibility = {
  canFinishWithoutFiltering({ messageKey, folder, postOutgoingType }) {
    if (messageKey !== 0 || folder?.server?.type !== "imap") {
      return false;
    }
    try {
      const filters = folder.getFilterList(null);
      for (let index = 0; index < filters.filterCount; index++) {
        const filter = filters.getFilterAt(index);
        if (filter.enabled && (filter.filterType & postOutgoingType)) {
          return false;
        }
      }
      return true;
    } catch {
      // An unreadable rule list is not equivalent to an empty rule list.
      return false;
    }
  },
};
