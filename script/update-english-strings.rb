require 'json'

strings_before = JSON.parse(File.read("config/locales/generated/en.json"))['en']
system "node_modules/.bin/i18nliner export --directory=lib"
strings_after = JSON.parse(File.read("config/locales/generated/en.json"))['en']

if strings_before == strings_after
  puts "english translation strings are unchanged"
  system "git checkout config/locales/generated/en.json"
else
  puts "english strings have changed"
  sorted_strings = Hash[strings_after.sort]
  File.write("config/locales/generated/en.json", JSON.pretty_generate(en: sorted_strings))
end
