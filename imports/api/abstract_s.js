import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const AbstractCollection = new Mongo.Collection('abs_collection');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('absPrintOut', function absCollectionPublication() {
    const currentUserId = this.userId;

    return AbstractCollection.find({ _id: currentUserId});
  });
}

Meteor.methods({
	'abs_collection.preview'(absTitle, authorNames, affilNames, affilOfAuthor, useSuperscriptIndic, keyWords, absContent, absContentMD) {
		check(absTitle, String);
		check(authorNames, Array);
		check(affilNames, Array);
		check(affilOfAuthor, Array);
		check(keyWords, String);
		check(absContentMD, String);	

		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		AbstractCollection.update(
			{ _id: this.userId},
			{ 
				$set: {
				title: absTitle, // "title"
				authors: authorNames, // [authA, authB, authC]
				affiliations: affilNames, // [affilX, affilY, affilZ]
				affilSuperscript: affilOfAuthor, // [ [1], [2, 3], [1, 2, 3] ]
				useSuperscriptIndic: useSuperscriptIndic,
				keywords: keyWords.slice(0, -2), // "kw1, kw2, kw3, "
				absContent: absContent, // raw abs content
				absContentMD: absContentMD, // absContent parsed by markdown

				createdAt: new Date(),
				email: Meteor.user().emails[0].address,
				presenter: authorNames[0],
				preAffil: affilNames[0],
				}
			},
			{ upsert: true }
		);
	},
		
	'abs_collection.submit'(completeSubmit){
		check(completeSubmit, Boolean);

		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		AbstractCollection.update(
			{ _id: this.userId},
			{
				$set: {
					completeSubmit: completeSubmit,

					submittedAt: new Date(),
				}
			},
			{ upsert: true }
		);

	},
});