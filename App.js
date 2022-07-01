import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {colors, CLEAR, ENTER, colorsToEmoji} from './src/constants';
import Keyboard from './src/components/Keyboard';

const NUMBER_OF_TRIES = 5;
const copyArray = arr => {
  return [...arr.map(rows => [...rows])];
};

const getDayOfTheYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
};
export default function App() {
  const words = ['hello', 'hii'];
  const word = words[0];
  const letters = word.split(''); //h,e,l,l,o
  const isDarkMode = useColorScheme() === 'dark';
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill('')),
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState('Playing');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
  }, [curRow]);

  const onKeyPressed = key => {
    if (gameState !== 'Playing') {
      return;
    }
    const updatedRows = copyArray(rows);
    if (key === CLEAR) {
      const prevCol = curCol - 1;
      if (prevCol >= 0) {
        updatedRows[curRow][prevCol] = '';
        setRows(updatedRows);
        setCurCol(prevCol);
      }
      return;
    }
    if (key === ENTER && curCol === rows[0].length) {
      setCurRow(curRow + 1);
      setCurCol(0);
    }
    if (curCol < rows[0].length) {
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      setCurCol(curCol + 1);
    }
  };

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  };

  const getCellBGColor = (row, col) => {
    let letter = rows[row][col];
    if (row >= curRow) {
      return colors.black;
    }
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };
  const getAllLetterWithColor = color => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getCellBGColor(i, j) === color),
    );
  };
  const checkGameState = () => {
    if (checkIfWon() && gameState !== 'Won') {
      Alert.alert('Hooray', 'You Won');
      setGameState('Won');
    } else if (checkIfLost() && gameState !== 'Lost') {
      Alert.alert('Meh', 'Try again tomorrow');
      setGameState('Lost');
    }
  };
  const checkIfWon = () => {
    const row = rows[curRow - 1];
    return row.every((letter, i) => letter === letters[i]);
  };
  const checkIfLost = () => {
    return checkIfWon() && curRow === rows.length;
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar styles="light" />
      <Text style={styles.title}>{'Wordle'.toUpperCase()}</Text>
      <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
            {row.map((letter, j) => (
              <View
                key={`cell-${i}-${j}`}
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(i, j)
                      ? colors.lightgrey
                      : colors.darkgrey,
                    backgroundColor: getCellBGColor(i, j),
                  },
                ]}>
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={getAllLetterWithColor(colors.primary)}
        yellowCaps={getAllLetterWithColor(colors.secondary)}
        greyCaps={getAllLetterWithColor(colors.darkgrey)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 7,
  },
  map: {
    alignSelf: 'stretch',
    marginVertical: 20,
  },
  row: {
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    flex: 1,
    height: 30,
    borderWidth: 2,
    borderColor: colors.darkgrey,
    aspectRatio: 1,
    margin: 3,
    maxWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    color: colors.lightgrey,
    fontSize: 28,
    fontWeight: 'bold',
  },
});
