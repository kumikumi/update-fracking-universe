// Constants
const RESTART_SERVER_COMMAND = "systemctl restart starbound-server"

// Imports
const childProcess = require('child_process')

// Helpers
const run = (cmd) => childProcess.execSync(cmd, {stdio: "inherit"})
const r = (cmd) => childProcess.execSync(cmd).toString().trim()
const toStr = (ref) => {
    const tag = r(`git describe --tags ${ref}`)
    return tag && `${tag} (${ref})` || ref
}

// Code
console.log("Fetching all tags...")
run("git fetch --all --tags")

const latestReleaseRef = r("git rev-list --tags --max-count=1")
const latestReadable = toStr(latestReleaseRef)

const currentRef = r("git rev-parse HEAD")
const currentReadable = toStr(currentRef)

console.log(`latest: ${latestReadable}`)
console.log(`current: ${currentReadable}`)

if (currentRef !== latestReleaseRef) {
    console.log(`Checking out ${latestReadable}`)
    run(`git checkout ${latestReleaseRef}`)
    console.log("Restarting server...")
    run(RESTART_SERVER_COMMAND)
} else {
    console.log("Already up to date.")
}