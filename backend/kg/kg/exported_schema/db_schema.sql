CREATE TABLE source (
	id VARCHAR NOT NULL, 
	added_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	title TEXT, 
	description TEXT, 
	abbreviation TEXT, 
	uri TEXT, 
	PRIMARY KEY (id), 
	UNIQUE (title), 
	UNIQUE (abbreviation)
);

CREATE TABLE report (
	id VARCHAR NOT NULL, 
	added_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	embedding VECTOR(384) NOT NULL, 
	source_id VARCHAR NOT NULL, 
	identifier TEXT, 
	title TEXT, 
	report_type TEXT, 
	uri TEXT, 
	report_metadata JSONB, 
	n_excerpts INTEGER, 
	description TEXT, 
	sha256hash VARCHAR(64), 
	version INTEGER, 
	published_at DATE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(source_id) REFERENCES source (id)
);

CREATE TABLE excerpt (
	id VARCHAR NOT NULL, 
	added_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	embedding VECTOR(384) NOT NULL, 
	report_id VARCHAR NOT NULL, 
	source_id VARCHAR NOT NULL, 
	title TEXT, 
	content_type TEXT, 
	json_content JSONB, 
	description TEXT, 
	excerpt_index INTEGER, 
	text_content TEXT, 
	PRIMARY KEY (id), 
	FOREIGN KEY(report_id) REFERENCES report (id), 
	FOREIGN KEY(source_id) REFERENCES source (id)
);

CREATE TABLE uentity (
	id VARCHAR NOT NULL, 
	added_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	embedding VECTOR(384) NOT NULL, 
	title TEXT, 
	entity_type TEXT, 
	PRIMARY KEY (id), 
	UNIQUE (title)
);

CREATE TABLE entity (
	id VARCHAR NOT NULL, 
	added_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	uentity_id VARCHAR NOT NULL, 
	report_id VARCHAR NOT NULL, 
	source_id VARCHAR NOT NULL, 
	excerpt_id VARCHAR NOT NULL, 
	title TEXT, 
	entity_type TEXT, 
	PRIMARY KEY (id), 
	FOREIGN KEY(uentity_id) REFERENCES uentity (id), 
	FOREIGN KEY(report_id) REFERENCES report (id), 
	FOREIGN KEY(source_id) REFERENCES source (id), 
	FOREIGN KEY(excerpt_id) REFERENCES excerpt (id)
);