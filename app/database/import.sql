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

INSERT INTO departments (name)
VALUES
('Management'),
('Human Resources'),
('Recruitment Team'),
('Event Team'),
('Media Team'),
('Convoy Control');

INSERT INTO team_members (name)
VALUES
('Wietsegaming'),
('MaleklecoCZE'),
('Martas18'),
('Lukyy09');

INSERT INTO roles (name, code)
VALUES
('Founder', 'founder'),
('Chief Executive Officer', 'ceo'),
('Chief Administrative Officer', 'cao'),
('Chief Operating Officer', 'coo'),
('Content Manager', 'cm'),
('Human Resources Director', 'hrd'),
('Human Resources', 'hr'),
('Recruitment Team Director', 'rtd'),
('Recruitment Team', 'rt'),
('Event Team Manager', 'etm'),
('Event Team', 'et'),
('Media Team Manager', 'mtm'),
('Media Team', 'mt'),
('Convoy Control Manager', 'ccm'),
('Convoy Control', 'cc');

INSERT INTO department_team_member (team_member_id, department_id, role_id)
VALUES
(1, 1, 1),
(1, 2, 7),
(1, 3, 8),
(1, 4, 10),
(1, 5, 12),
(2, 1, 2),
(2, 2, 6),
(3, 1, 4),
(3, 6, 14),
(4, 3, 9),
(4, 4, 13);

CREATE TABLE gallery (
  title TEXT
)

INSERT INTO team (member, function, role)
VALUES
('Simpelcity', 'Founder', 'founder'),
('MaleklecoCZE', 'Chief Executive Officer', 'ceo')

INSERT INTO gallery (title)
VALUES
('Scania by Lukyy09'),
('DAF by Simpelcity')