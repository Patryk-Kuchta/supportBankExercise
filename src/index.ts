import { question } from 'readline-sync'
import { listAccount, listAll } from './UserActions'
import initialize from './Initialize'

// Initialize the data
initialize()

let userAnswer = 'HELP'

while (userAnswer !== 'QUIT') {
  switch (userAnswer) {
    case 'HELP': {
      console.log('Available commands:')
      console.log(
        "  LIST ALL       - Lists each person's name and total amount owed or owed to them."
      )
      console.log(
        '  LIST [Account] - Lists every transaction for the specified account by name.'
      )
      console.log('  HELP           - Shows this available commands list.')
      console.log('  QUIT           - Exits the program.')
      break
    }
    case 'LIST ALL': {
      listAll()
      break
    }
    case userAnswer.match(/^LIST\s+(.+)/)?.input: {
      const accountName = userAnswer.replace(/^LIST\s+/i, '').trim()
      console.log(accountName)

      listAccount(accountName)
      break
    }
    default: {
      console.log(
        'Unknown command. Type HELP for a list of available commands.'
      )
      break
    }
  }

  // Prompt for the next command
  userAnswer = question('Enter command: ')
}

console.log('Goodbye!')
