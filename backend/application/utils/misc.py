import os
from pathlib import PurePath





################################### FILE MANAGER ##################################

safe_directory_separator = '#'
forbidden_text_name = ['..', os.sep, safe_directory_separator]
forbidden_text_path = ['..']

def checkValidName(toCheck:str):
    for i in forbidden_text_name:
        if i in toCheck:
            return False
    return True


def checkValidPath(baseDir:str, check:str):
    for i in forbidden_text_path:
        if i in check:
            print(i, " found in path, rejecting")
            return False
    
    if not PurePath(check).is_relative_to(baseDir):
        print(check, " is not relative to ", baseDir)
        return False
    return True


