# CustomUI

This Thunderbird Experiment exposes one extension point used by Markdown Here
Revival: `LOCATION_COMPOSE_EDITOR`.

The background script registers the compose preview document with `add()` and
`remove()`. Code inside that document can read its compose-window context with
`getContext()`, change local visibility or width with `setLocalOptions()`, and
listen for context changes through `onEvent`.

The implementation intentionally excludes the address book, calendar, message
window, and download-dialog locations from the original general-purpose
CustomUI experiment. Keeping only the compose editor reduces the privileged
surface that must be reviewed for each Thunderbird ESR.
