import React, { useState, useRef, useCallback } from 'react';
import {
	View,
	Text,
	Image,
	ImageBackground,
	StyleSheet,
	Dimensions,
	Animated,
	TouchableOpacity,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useStatus } from '../statusContext';
import { getIdPaciente } from '../storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const backgroundImage = require('../assets/home_background.png');
const shadow = require('../assets/sombra.png');
const dinoAnimation = require('../assets/dinoAnimation.json');
const nivel = require('../assets/level.png');

const Level = ({ levelNumber }) => {
	return (
		<View style={styles.levelContainer}>
			<Text style={styles.text}>{levelNumber}</Text>
			<Image source={nivel} style={styles.level} />
		</View>
	);
};

const ProgressBar = ({ progress }) => {
	return (
		<View style={styles.progressBarContainer}>
			<View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
		</View>
	);
};

const TopicWithProgress = ({ title, progress }) => {
	return (
		<View style={styles.topicContainer}>
			<Text style={styles.topicos}>{title}</Text>
			<ProgressBar progress={progress} />
		</View>
	);
};

const ProgressBar2 = ({ progress }) => {
	return (
		<View style={styles.progressBarContainer2}>
			<View style={[styles.progressBar2, { width: `${progress * 100}%` }]} />
		</View>
	);
};

const TopicWithProgress2 = ({ title, progress }) => {
	return (
		<View style={styles.topicContainer2}>
			<Text style={styles.topicos2}>{title}</Text>
			<ProgressBar2 progress={progress} />
		</View>
	);
};

export default function Home() {
	const { status } = useStatus();
	const [characterStatus, setCharacterStatus] = useState(null);
	const idPaciente = getIdPaciente();

	const updateStatusFromDb = useCallback(async () => {
		try {
			const response = await axios.get(
				`https://9c63-2804-14c-bf3a-8061-4976-4c7-486-2363.ngrok-free.app/character-status/${idPaciente}`
			);
			setCharacterStatus(response.data);
		} catch (error) {
			console.error('Erro ao buscar status do personagem:', error);
		}
	}, [idPaciente]);

	useFocusEffect(
		useCallback(() => {
			updateStatusFromDb();
		}, [updateStatusFromDb])
	);

	const panelYPosition = useRef(
		new Animated.Value(-windowHeight / 4.3)
	).current;
	const buttonYPosition = useRef(new Animated.Value(0)).current;
	const [panelOpen, setPanelOpen] = useState(false);

	const togglePanel = () => {
		const toValue = panelOpen ? -windowHeight / 4.3 : 0;
		const buttonToValue = panelOpen ? 0 : windowHeight / 4.3 + 10;

		Animated.timing(panelYPosition, {
			toValue: toValue,
			duration: 500,
			useNativeDriver: true,
		}).start();

		Animated.timing(buttonYPosition, {
			toValue: buttonToValue,
			duration: 500,
			useNativeDriver: true,
		}).start();

		if (!panelOpen) {
			updateStatusFromDb();
		}

		setPanelOpen(!panelOpen);
	};

	const panelStyle = {
		transform: [{ translateY: panelYPosition }],
		backgroundColor: '#FBFEF4',
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignContent: 'center',
		position: 'absolute',
		width: '100%',
		top: 0,
		height: windowHeight / 4.3,
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
	};

	const buttonStyle = {
		transform: [{ translateY: buttonYPosition }],
		position: 'absolute',
		top: 5,
		alignItems: 'center',
	};

	return (
		<View style={styles.container}>
			<ImageBackground
				source={backgroundImage}
				resizeMode="cover"
				style={styles.imageBackground}
			>
				<Image source={shadow} style={styles.shadow} />
				<LottieView source={dinoAnimation} autoPlay loop style={styles.dino} />
				<Animated.View style={panelStyle}>
					<Level levelNumber={0} />
					<TopicWithProgress2 progress={(characterStatus?.XP ?? 0) / 100} />
					<TopicWithProgress
						title="Energia"
						progress={(characterStatus?.Energia ?? 0) / 20}
					/>
					<TopicWithProgress
						title="Felicidade"
						progress={(characterStatus?.Felicidade ?? 0) / 20}
					/>
					<TopicWithProgress
						title="Alimentação"
						progress={(characterStatus?.Alimentação ?? 0) / 20}
					/>
					<TopicWithProgress
						title="Força"
						progress={(characterStatus?.Força ?? 0) / 20}
					/>
				</Animated.View>

				<TouchableOpacity onPress={togglePanel} style={buttonStyle}>
					<AntDesign
						name={panelOpen ? 'up' : 'down'}
						size={30}
						color={'#5C4B4B'}
					/>
				</TouchableOpacity>
			</ImageBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	imageBackground: {
		flex: 1,
		width: windowWidth,
		height: windowHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
	dino: {
		width: 320,
		height: 320,
		position: 'absolute',
		bottom: 70,
	},
	shadow: {
		width: 441,
		height: 184,
		position: 'absolute',
		bottom: 30,
	},
	// ============================================================
	progressBarContainer: {
		alignSelf: 'center',
		width: '90%',
		height: 20,
		backgroundColor: '#DCDCDC',
		borderRadius: 40,
		overflow: 'hidden',
		marginTop: 10,
		borderWidth: 1,
		borderColor: 'white',
		padding: 2,
	},
	progressBar: {
		height: '100%',
		backgroundColor: '#32B708',
		borderRadius: 40,
	},
	topicos: {
		color: '#5C4B4B',
		fontFamily: 'Poppins_500Medium',
		fontSize: 16,
		alignSelf: 'flex-start',
		marginLeft: 15,
		marginTop: 5,
		marginBottom: -15,
	},
	topicContainer: {
		width: '50%',
	},
	//============================================================
	progressBarContainer2: {
		alignSelf: 'center',
		width: '95%',
		height: 25,
		backgroundColor: '#DCDCDC',
		borderRadius: 40,
		overflow: 'hidden',
		marginTop: 10,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: 'white',
		padding: 3,
	},
	progressBar2: {
		height: '100%',
		backgroundColor: '#1A7EF1',
		borderRadius: 40,
	},
	topicos2: {
		color: '#5C4B4B',
		fontFamily: 'Poppins_500Medium',
		fontSize: 16,
		alignSelf: 'flex-start',
		marginLeft: 12,
		marginTop: -15,
		marginBottom: -25,
	},
	topicContainer2: {
		width: '90%',
	},
	//============================================================
	levelContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 15,
		marginTop: -22,
	},
	level: {
		height: 512 / 15,
		width: 443.5 / 15,
		position: 'absolute',
	},
	text: {
		alignContent: 'center',
		fontSize: 15,
		color: '#1A7EF1',
		fontFamily: 'Poppins_700Bold',
		top: 1.5,
	},
});
