require 'dotenv'
require 'json'
require 'faraday'
require 'faraday_middleware'
require 'optparse'

Dotenv.load

TRANSIFEX_TOKEN = ENV['TRANSIFEX_TOKEN']
REVIEWERS="r=jonw+gerrit@instructure.com,r=csutter@instructure.com,r=mysti@instructure.com,r=nathan@instructure.com"
PROJECT = "canvas-offline-course-viewer"
RESOURCE = "viewer-strings"
ENGLISH_TRANSLATION_FILE = "config/locales/generated/en.json"

$config = {
  commit: false,
  submit: "",
  upload: false,
}

option_parser = OptionParser.new do |opts|
  opts.on("--help", "Print help documentation") do
    puts opts
    exit 1
  end

  opts.on("--commit", "Create a gerrit commit for these language changes.") do |value|
    $config[:commit] = value
  end

  opts.on("--submit", "DANGEROUS! For bots only: submit the commit instead of just creating a patchset. Implies --commit") do |value|
    $config[:submit] = value ? "submit,l=Verified+1," : ""
    $config[:commit] = value
  end

  opts.on("--upload", "DANGEROUS! Upload the english source file to transifex if it has changed.") do |value|
    $config[:upload] = value
  end
end
option_parser.parse!

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

def export_english_from_source
  system "ruby script/update-english-strings.rb"
end

def create_transifex_connection
  base_url = "https://www.transifex.com/api/2/project/#{PROJECT}/resource/#{RESOURCE}"

  Faraday.new(base_url) do |conn|
    conn.adapter Faraday.default_adapter
    conn.basic_auth "api", TRANSIFEX_TOKEN
    conn.headers['Accept'] = 'application/json'
    conn.response :json
  end
end

def import_translations_from_transifex(api)
  resource_response = api.get('', details: true)
  languages = resource_response.body['available_languages'].map { |h| h['code'] }

  languages.each do |lang|
    next if lang == 'en_US'
    puts "downloading #{lang}"
    lang_response = api.get("translation/#{lang}", mode: 'onlytranslated')
    translation = JSON.parse(lang_response.body['content'])
    translation.delete_if { |k, v| v.empty? }
    # lets not sort these for now. probably doesn't matter.
    # translation = Hash[translation.sort]
    File.write("config/locales/#{lang}.json", JSON.pretty_generate({lang => translation}))
  end
end

def find_changed_language_files
  capture(%w(git status config/locales --porcelain)).split("\n").map {|s| s[3..-1]}
end

def commit_language_changes_to_gerrit(changed_files)
  return unless $config[:commit]
  if changed_files.empty?
    puts "no language changes to commit"
    return
  end

  puts "committing language changes"
  changed_files.each { |file| run ["git", "add", file] }
  run ["git", "commit", "-m", "new translations :robot: :i18n:"]
  run ["git", "push", "origin", "HEAD:refs/for/master%#{$config[:submit]}#{REVIEWERS}"]
end

def upload_english_to_transifex(api, changed_files)
  return unless $config[:upload]
  unless changed_files.include?(ENGLISH_TRANSLATION_FILE)
    puts "no english changes to upload"
    return
  end

  puts "uploading english source file"
  english_source = File.read(ENGLISH_TRANSLATION_FILE)
  upload_response = api.put('content') do |request|
    request.headers["Content-Type"] = 'application/json'
    request.body = JSON.generate(content: english_source)
  end
  puts JSON.pretty_generate(upload_response.body)
end

api = create_transifex_connection

export_english_from_source
import_translations_from_transifex(api)
changed_files = find_changed_language_files
commit_language_changes_to_gerrit(changed_files)
upload_english_to_transifex(api, changed_files)
