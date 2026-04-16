const fs = require('fs')
const path = require('path')

const DIRS = [
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src', 'components')
]

const REPLACEMENTS = [
  // Backgrounds
  { regex: /['"]#ffffff['"]/gi, replacement: "'var(--bg-card)'" },
  { regex: /['"]#fff['"]/gi, replacement: "'var(--bg-card)'" },
  { regex: /['"]#F8F9FC['"]/gi, replacement: "'var(--bg-main)'" },
  { regex: /['"]#fafafa['"]/gi, replacement: "'var(--bg-hover)'" },
  { regex: /rgba\(0,0,0,0\.4\)/g, replacement: "var(--modal-bg)" },
  
  // Texts
  { regex: /['"]#1F2937['"]/gi, replacement: "'var(--text)'" },
  { regex: /['"]#374151['"]/gi, replacement: "'var(--text-secondary)'" },
  { regex: /['"]#6B7280['"]/gi, replacement: "'var(--text-muted)'" },
  { regex: /['"]#9CA3AF['"]/gi, replacement: "'var(--text-light)'" },
  
  // Borders
  { regex: /['"]#F3F4F6['"]/gi, replacement: "'var(--border-light)'" },
  { regex: /['"]#E5E7EB['"]/gi, replacement: "'var(--border)'" },
  
  // Custom badges/status (using new index.css tokens)
  { regex: /['"]#e8f5e9['"]/gi, replacement: "'var(--success-bg)'" },
  { regex: /['"]#16a34a['"]/gi, replacement: "'var(--success-text)'" },
  { regex: /['"]#fee2e2['"]/gi, replacement: "'var(--danger-bg)'" },
  { regex: /['"]#dc2626['"]/gi, replacement: "'var(--danger-text)'" },
  { regex: /['"]#fff3e0['"]/gi, replacement: "'var(--warning-bg)'" },
  { regex: /['"]#e65c00['"]/gi, replacement: "'var(--warning-text)'" },
  
  // Shadows (only inside strings)
  { regex: /['"]0 2px 12px rgba\(0,0,0,0\.04\)['"]/g, replacement: "'var(--shadow-sm)'" },
  { regex: /['"]0 4px 16px rgba\(0,0,0,0\.08\)['"]/g, replacement: "'var(--shadow-md)'" },
  { regex: /['"]0 20px 60px rgba\(0,0,0,0\.15\)['"]/g, replacement: "'var(--shadow-lg)'" }
]

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false
  
  REPLACEMENTS.forEach(({ regex, replacement }) => {
    if (regex.test(content)) {
      content = content.replace(regex, replacement)
      modified = true
    }
  })
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`Updated: ${filePath}`)
  }
}

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      processDirectory(fullPath)
    } else if (entry.isFile() && fullPath.endsWith('.jsx')) {
      processFile(fullPath)
    }
  }
}

DIRS.forEach(dir => processDirectory(dir))
console.log('Migration complete.')
