REVIEWERS="r=jonw+gerrit@instructure.com,r=csutter@instructure.com,r=mysti@instructure.com,r=nathan@instructure.com"
PROJECT = "canvas-offline-course-viewer"
RESOURCE = "viewer-strings"
ENGLISH_TRANSLATION_FILE = "config/locales/generated/en.json"

def capture(cmd)
  result = IO.popen(cmd) do |output|
    output.read()
  end
  exit $?.exitstatus if $?.exitstatus != 0
  return result
end

def run(cmd)
  system(*cmd)
  if $?.exitstatus != 0
    exit $?.exitstatus
  end
end

def find_changed_language_files
  capture(%w(git status config/locales --porcelain)).split("\n").map {|s| s[3..-1]}
end
