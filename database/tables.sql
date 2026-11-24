CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    admin BOOL DEFAULT FALSE NOT NULL,
    profile_url TEXT,
    profile_path TEXT
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL
);

CREATE TABLE department_team_member (
    team_member_id INT NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (department_id, team_member_id, role_id)
);

CREATE TABLE gallery (
  id SERIAL PRIMARY KEY,
  title TEXT,
  image_path TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);