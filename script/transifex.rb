require 'dotenv'
require 'json'
require 'faraday'
require 'faraday_middleware'
require 'optparse'
require_relative 'script-common'

Dotenv.load

TRANSIFEX_TOKEN = ENV['TRANSIFEX_TOKEN']

$config = {
  upload: false,
}

option_parser = OptionParser.new do |opts|
  opts.on("--help", "Print help documentation") do
    puts opts
    exit 1
  end

  opts.on("--upload", "DANGEROUS! Upload the english source file to transifex if it has changed.") do |value|
    $config[:upload] = value
  end
end
option_parser.parse!

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
import_translations_from_transifex(api)
changed_files = find_changed_language_files
upload_english_to_transifex(api, changed_files)
