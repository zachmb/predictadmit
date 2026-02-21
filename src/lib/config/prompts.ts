export interface EssayPrompt {
	id: string;
	title: string;
	description: string;
}

export const schoolPrompts: Record<string, EssayPrompt[]> = {
	harvard: [
		{
			id: 'harvard-1',
			title: 'Harvard Intellectual Life',
			description:
				'Harvard has long recognized the importance of enrolling a diverse student body. How will the life experiences that shape who you are today enable you to contribute to Harvard?'
		},
		{
			id: 'harvard-2',
			title: 'Extracurricular Activity',
			description:
				'Please briefly elaborate on one of your extracurricular activities or work experiences.'
		},
		{
			id: 'harvard-3',
			title: 'Intellectual Curiosity',
			description: 'List a few words or phrases that describe your ideal college community.'
		}
	],
	stanford: [
		{
			id: 'stanford-1',
			title: 'Intellectual Vitality',
			description:
				'The Stanford community is deeply curious and driven to learn in and out of the classroom. Reflect on an idea or experience that makes you genuinely excited about learning.'
		},
		{
			id: 'stanford-2',
			title: 'Roommate Essay',
			description:
				"Virtually all of Stanford's undergraduates live on campus. Write a note to your future roommate that reveals something about you or will help your roommate -- and us -- know you better."
		},
		{
			id: 'stanford-3',
			title: 'What matters to you?',
			description: 'Tell us about something that is meaningful to you, and why?'
		}
	],
	yale: [
		{
			id: 'yale-1',
			title: 'Why Yale?',
			description: 'What is it about Yale that has led you to apply? (125 words or fewer)'
		},
		{
			id: 'yale-2',
			title: 'Short Take 1',
			description:
				'Think about an idea or topic that has been intellectually exciting for you. Why are you drawn to it?'
		}
	],
	princeton: [
		{
			id: 'princeton-1',
			title: 'Extracurricular Activity',
			description:
				'Please briefly elaborate on one of your extracurricular activities or work experiences.'
		},
		{
			id: 'princeton-2',
			title: 'Your Voice',
			description:
				'At Princeton, we value diverse perspectives and the ability to have respectful dialogue about difficult issues. Share a time when you had a conversation with a person or a group of people about a difficult topic. What insight did you gain, and how would you incorporate that proficiency into your thinking in the future?'
		}
	],
	mit: [
		{
			id: 'mit-1',
			title: 'Selection of Major',
			description:
				'We know you lead a busy life, full of activities, many of which are required of you. Tell us about something you do simply for the pleasure of it.'
		},
		{
			id: 'mit-2',
			title: 'Collaborative Spirit',
			description:
				'At MIT, we bring people together to better the lives of others. MIT students work to improve their communities in different ways. Describe one way in which you have contributed to your community, whether in your family, the classroom, your neighborhood, etc.'
		}
	],
	columbia: [
		{
			id: 'columbia-1',
			title: 'Why Columbia?',
			description:
				'Why are you interested in attending Columbia University? We encourage you to consider the aspect(s) that you find most compelling and why. (200 words or fewer)'
		},
		{
			id: 'columbia-2',
			title: 'List of Books',
			description:
				'List the titles of the books, essays, poetry, short stories or plays you read outside of academic courses that you enjoyed most during secondary/high school.'
		}
	],
	uchicago: [
		{
			id: 'uchicago-1',
			title: 'Why UChicago?',
			description:
				'How does the University of Chicago, as you know it now, satisfy your desire for a particular kind of learning, community, and future? Please address with some specificity your own wishes and how they relate to UChicago.'
		},
		{
			id: 'uchicago-2',
			title: 'Uncommon Essay',
			description:
				'The University of Chicago has long been renowned for its provocative essay questions. Choose one of the following prompts...'
		}
	],
	upenn: [
		{
			id: 'upenn-1',
			title: 'Thank You Note',
			description:
				'Write a short thank-you note to someone you have not yet thanked and would like to acknowledge. (We encourage you to share this note with that person, if possible, and reflect on the experience!)'
		}
	]
};
