import { LetterItem } from './LetterItem'
import propTypes from 'prop-types'

export const LetterList = ({ letters, onToggleReadStatus, onOpenLetter }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {letters.map((letter) => (
          <div key={letter.id}>
            <LetterItem
              letter={letter}
              onOpen={() => onOpenLetter(letter)}
              onToggleRead={() => onToggleReadStatus(letter)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

LetterList.propTypes = {
  letters: propTypes.arrayOf(propTypes.object).isRequired,
  onToggleReadStatus: propTypes.func.isRequired,
  onOpenLetter: propTypes.func.isRequired,
}
