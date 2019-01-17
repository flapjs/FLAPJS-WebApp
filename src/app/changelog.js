//Version 0.3.2
const changeLog = [
  "FIXED: Allow cross-platform bundle building.",
  "FIXED: Corrected 'development' mode while in production.",
  "FIXED: NFA unreachable node checking is wrong.",
  "FIXED: Unreachable node warnings were not treated as notification warnings.",
  "Disabled service worker while in 'development' mode."
];

/*
  //Version 0.3.1
  const changeLog = [
    "FIXED: Renaming an uploaded file does not download file with new name.",
    "This is our first user-reported bug! Hooray!",
    "Thank you and have a hug whoever you are <3."
  ];
*/

const changeVersion = process.env.VERSION;
const result = {
  show: changeLog && changeLog.length > 0,
  log: "\nChangelog v" + changeVersion + ":\n - " + changeLog.join("\n - "),
  version: changeVersion
}
export default result;
