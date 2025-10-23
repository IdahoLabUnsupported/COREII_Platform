DECLARE @RoleCount int
SELECT @RoleCount = COUNT(*) 
FROM [COREII].[dbo].[Roles]

IF (@RoleCount < 1)
BEGIN
  Insert into [COREII].[dbo].[Roles] VALUES ('System Administrator',      'A super user that has all permissions',                              2024-04-14,  '1,2,3,4,5,6,7,8,9,10')
  Insert into [COREII].[dbo].[Roles] VALUES ('User Administrator',        'A user admin that has all user administration abilities',            2024-04-14,  '2,3,4' )
  Insert into [COREII].[dbo].[Roles] VALUES ('Role Administrator',        'A role admin that has all role administration abilities',            2024-04-14,  '5,6,7')
  Insert into [COREII].[dbo].[Roles] VALUES ('Report Editor',             'A role that allows for creation, editing, and deleting of reports',  2024-04-14,  '8,9,10')
  Insert into [COREII].[dbo].[Roles] VALUES ('Report Viewer',             'A role that allows for viewing of reports',                          2024-04-14,  '8')
  Insert into [COREII].[dbo].[Roles] VALUES ('DataEntry Specalist',       'A role that allows for entry of base data',                          2024-04-14,  '11,12,13')
  Insert into [COREII].[dbo].[Roles] VALUES ('Example Role',              'TEST ROLE a test role used to test styling of user/role pages',      2024-04-14,  '2,3')
  Insert into [COREII].[dbo].[Roles] VALUES ('Test Role',                 'TEST ROLE a test role used to test styling of user/role pages',      2024-04-14,  '2,3,4,5')
  Insert into [COREII].[dbo].[Roles] VALUES ('Psuedo Role',               'TEST ROLE a test role used to test styling of user/role pages',      2024-04-14,  '2')
  Insert into [COREII].[dbo].[Roles] VALUES ('Temp Role',                 'TEST ROLE a test role used to test styling of user/role pages',      2024-04-14,  '4')
  Insert into [COREII].[dbo].[Roles] VALUES ('Sample Role',               'TEST ROLE a test role used to test styling of user/role pages',      2024-04-14,  '4,5,6')
END

DECLARE @UserCount int
SELECT @UserCount = COUNT(*) 
FROM [COREII].[dbo].[Users]

IF (@UserCount < 1)
BEGIN
  Insert into [COREII].[dbo].[Users] VALUES ('Dylan',          'Johnson',         'dylan.johnson@inl.gov',       2024-04-14,   'johndb2'       )
  Insert into [COREII].[dbo].[Users] VALUES ('Lili',           'Cantillo',        'lilianne.cantillo@inl.gov',   2024-04-14,   'cantli'      )
  Insert into [COREII].[dbo].[Users] VALUES ('Jason',          'Kuipers',         'kuipers@jason@inl.gov',       2024-04-14,   'kuipjs'      )
  Insert into [COREII].[dbo].[Users] VALUES ('Stephan',        'Wilkins',         'wilkins@stephan@inl.gov',     2024-04-14,   'wilkst'      )
  Insert into [COREII].[dbo].[Users] VALUES ('Bob',            'Testuser',        'email@inl.gov',               2024-04-14,   'testUser'      )
  Insert into [COREII].[dbo].[Users] VALUES ('Joe',            'Testuser',        'email@inl.gov',               2024-04-14,   'testUser'      )
  Insert into [COREII].[dbo].[Users] VALUES ('John',           'Testuser',        'email@inl.gov',               2024-04-14,   'testUser'      )
  Insert into [COREII].[dbo].[Users] VALUES ('Greg',           'Testuser',        'email@inl.gov',               2024-04-14,   'testUser'      )
  Insert into [COREII].[dbo].[Users] VALUES ('Mike',           'Testuser',        'email@inl.gov',               2024-04-14,   'testUser'      )
END 


DECLARE @UserRoleCount int
SELECT @UserRoleCount = COUNT(*) 
FROM [COREII].[dbo].[RoleUser]

IF (@UserRoleCount < 1)
BEGIN
  Insert into [COREII].[dbo].[RoleUser] VALUES (2,1)
  Insert into [COREII].[dbo].[RoleUser] VALUES (3,1)
  Insert into [COREII].[dbo].[RoleUser] VALUES (5,1)
  Insert into [COREII].[dbo].[RoleUser] VALUES (4,2)
  Insert into [COREII].[dbo].[RoleUser] VALUES (6,2)
  Insert into [COREII].[dbo].[RoleUser] VALUES (5,3)
END 