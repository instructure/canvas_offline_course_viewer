require 'json'
require_relative 'script-common'

strings_before = JSON.parse(File.read(ENGLISH_TRANSLATION_FILE))['en']
system "node_modules/.bin/i18nliner export --directory=lib"
strings_after = JSON.parse(File.read(ENGLISH_TRANSLATION_FILE))['en']

if strings_before == strings_after
  puts "english translation strings are unchanged"
  # make sure we don't change anything
  system "git checkout config/locales/generated/en.json"
else
  puts "english strings have changed"
  # lets not sort these for now. probably doesn't matter.
  # strings_after = Hash[strings_after.sort]
  File.write(ENGLISH_TRANSLATION_FILE, JSON.pretty_generate(en: strings_after))
end
