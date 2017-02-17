require 'optparse'
require_relative 'script-common'

$config = {
  submit: ""
}

option_parser = OptionParser.new do |opts|
  opts.on("--help", "Print help documentation") do
    puts opts
    exit 1
  end

  opts.on("--submit", "DANGEROUS! For bots only: submit the commit instead of just creating a patchset.") do |value|
    $config[:submit] = value ? "submit,l=Verified+1," : ""
  end
end

option_parser.parse!

def commit_language_changes_to_gerrit(changed_files)
  if changed_files.empty?
    puts "no language changes to commit"
    return
  end

  puts "committing language changes"
  changed_files.each { |file| run ["git", "add", file] }
  run ["git", "commit", "-m", "new translations :robot: :i18n:"]
  run ["git", "push", "origin", "HEAD:refs/for/master%#{$config[:submit]}#{REVIEWERS}"]
end

changed_files = find_changed_language_files
commit_language_changes_to_gerrit(changed_files)
