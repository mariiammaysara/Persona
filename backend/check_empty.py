import os

def check_empty_dirs(root_dir):
    empty_dirs = []
    for root, dirs, files in os.walk(root_dir):
        if not dirs and not files:
            empty_dirs.append(root)
    return empty_dirs

backend_path = r"c:\Users\Mariam Hagag\Desktop\Persona\backend"
empty = check_empty_dirs(backend_path)
print("Empty directories:")
for d in empty:
    print(d)
