/**
 * Other names people search by. The search finds a page by these names as well as by
 * its title, so "Netaji" finds Subhas Chandra Bose and "Bapu" finds Gandhi.
 * Keys are subject folder names. Add a line here whenever a subject is known by another name.
 * (An organisation's own `aliases:` line in its index.md is picked up too.)
 */
export const ALIASES: Record<string, string[]> = {
  "mahatma-gandhi": ["Bapu", "Mohandas Gandhi", "Mohandas Karamchand Gandhi", "Gandhiji", "Father of the Nation", "M. K. Gandhi"],
  "subhas-chandra-bose": ["Netaji", "Subhash Chandra Bose", "Subash Chandra Bose", "Subhas Bose", "Subhash Bose"],
  "b-r-ambedkar": ["Babasaheb", "Dr Ambedkar", "Bhimrao Ambedkar", "Bhimrao Ramji Ambedkar", "Babasaheb Ambedkar"],
  "bhagat-singh": ["Shaheed Bhagat Singh", "Shaheed-e-Azam", "Bhagat Sing"],
  "chandrashekhar-azad": ["Chandra Shekhar Azad", "Chandrasekhar Azad", "Chandra Sekhar Azad", "Azad", "Panditji", "Balraj"],
  "ashfaqulla-khan": ["Ashfaqullah Khan", "Ashfaq Ullah Khan", "Ashfaqulla", "Ashfaq", "Ashfaque Ullah Khan"],
  "ram-prasad-bismil": ["Bismil", "Pandit Ram Prasad Bismil", "Ramprasad Bismil"],
  "batukeshwar-dutt": ["B. K. Dutt", "BK Dutt", "Batukeshwar Datta", "Batukeshwar Dutta", "Batuk Dutt"],
  "sukhdev-thapar": ["Sukhdev", "Sukhdev Thapar", "Sukhdev Raj"],
  "shivaram-rajguru": ["Rajguru", "Raj Guru", "Shivram Rajguru", "Shivaram Hari Rajguru"],
  "durga-bhabhi": ["Durgawati Devi", "Durga Devi Vohra", "Durga Devi", "Durgavati Devi"],
  "rajendra-lahiri": ["Rajendranath Lahiri", "Rajendra Nath Lahiri"],
  "roshan-singh": ["Thakur Roshan Singh"],
  "jawaharlal-nehru": ["Nehru", "Pandit Nehru", "Chacha Nehru", "Pandit Jawaharlal Nehru"],
  "rani-lakshmibai": ["Rani of Jhansi", "Jhansi ki Rani", "Laxmibai", "Lakshmi Bai", "Manikarnika"],
  "lala-lajpat-rai": ["Punjab Kesari", "Lion of Punjab", "Lajpat Rai"],
  "bal-gangadhar-tilak": ["Lokmanya Tilak", "Lokmanya", "Tilak"],
  "sarojini-naidu": ["Nightingale of India", "Bharat Kokila"],
  "kasturba-gandhi": ["Kasturba", "Ba", "Kasturbai"],
  "kakori-train-action": ["Kakori conspiracy", "Kakori robbery", "Kakori train robbery", "Kakori case", "Kakori kand", "Kakori Kaand"],
  "dandi-march-salt-satyagraha": ["Salt March", "Dandi March", "Salt Satyagraha", "Namak Satyagraha"],
  "quit-india-movement": ["August Movement", "August Kranti", "Do or Die", "Bharat Chhodo Andolan"],
  "revolt-of-1857": ["Sepoy Mutiny", "Indian Mutiny", "First War of Independence", "Great Revolt of 1857"],
  "jallianwala-bagh-massacre": ["Amritsar massacre", "Jallianwalla Bagh", "Jallianwala Bagh"],
  "poona-pact": ["Yerwada Pact", "Yeravda Pact"],
  "indian-national-army": ["INA", "Azad Hind Fauj"],
  "indian-national-congress": ["Congress", "INC", "Congress party"],
  "hindustan-republican-association": ["HRA"],
  "hindustan-socialist-republican-association": ["HSRA"],
  "central-legislative-assembly-bombing": ["Assembly bomb", "Assembly bombing 1929"],
};

/** Every other name for a subject, from this list and its own `aliases:` line. */
export function aliasesFor(id: string, own?: string): string[] {
  const fromFile = (own ?? "").split(/[;,]/).map((s) => s.trim()).filter(Boolean);
  return [...new Set([...(ALIASES[id] ?? []), ...fromFile])];
}
