require 'dotenv'
require 'json'
require 'faraday'
require 'faraday_middleware'

require 'pp'

Dotenv.load

TRANSIFEX_TOKEN = ENV['TRANSIFEX_TOKEN']
REVIEWERS="r=jonw@instructure.com,r=csutter@instructure.com,r=mysti@instructure.com,r=nathan@instructure.com"
PROJECT = "canvas-offline-course-viewer"
RESOURCE = "viewer-strings"

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

def upload_english_on_master_to_transifex
  puts "upload to transifex not implemented yet"
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

def import_translations_from_transifex
  api = create_transifex_connection

  resource_response = api.get('', details: true)
  languages = resource_response.body['available_languages'].map { |h| h['code'] }

  languages.each do |lang|
    next if lang == 'en_US'
    lang_response = api.get("translation/#{lang}", mode: 'onlytranslated')
    translation = JSON.parse(lang_response.body['content'])
    translation.delete_if { |k, v| v.empty? }
    translation = Hash[translation.sort]
    File.write("config/locales/#{lang}.json", JSON.pretty_generate({lang => translation}))
  end
end

def commit_changes_to_gerrit
  changed_files = capture(%w(git status --porcelain)).split("\n").map {|s| s[3..-1]}
  if changed_files.empty?
    puts "no changes to commit"
  else
    changed_files.each { |file| run ["git", "add", file] }
    run ["git", "commit", "-m", "new translations :robot-face: :i18n:"]
    run ["git", "push", "origin", "master:refs/for/master%submit,l=Verified+1,#{REVIEWERS}"]
  end
end

upload_english_on_master_to_transifex
export_english_from_source
import_translations_from_transifex
commit_changes_to_gerrit
