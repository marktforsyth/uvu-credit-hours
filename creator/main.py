# TODO: make the beginning and ending (the h1 title mostly) adapt based on which page it is :D
# 2) make adaptive buttons
import requests
from bs4 import BeautifulSoup


def fetch_data():
    url = 'https://www.uvu.edu/catalog/current/courses'
    page = requests.get(url).text
    soup = BeautifulSoup(page, 'html.parser')

    courses = []
    for table in soup.find_all(class_='courses_table'):
        for link in table.find_all('a'):
            subject_page = requests.get(link.get('href')).text
            subject_soup = BeautifulSoup(subject_page, 'html.parser')

            courses += subject_soup.find_all(class_='course')

    return courses


def get_courses(courses, credit_hours, no_prereq):
    output = ''

    for course in courses:
        text = course.find(class_='credits').get_text().split()

        if (
            (
                (text[1] == 'to' and credit_hours >= float(text[0]) and credit_hours <= float(text[2])) or
                float(text[0]) == float(credit_hours)
            ) and
            (
                len(course.find_all(class_='prereq')) == 0 or
                not no_prereq
            )
        ):
            output += course.prettify()

    return output


def gen_normal_file(credit_hours):
    if credit_hours == 1:
        return 'index.html'

    return f'{credit_hours}-credit-hours.html'


def gen_link(credit_hours, no_prereq, current):
    if current:
        return f'<div>{credit_hours}</div>'
    
    if no_prereq:
        return f'<a href="./{credit_hours}-credit-hours-no-prereq.html">{credit_hours}</a>'

    return f'<a href="./{gen_normal_file(credit_hours)}">{credit_hours}</a>'


def main():
    courses = fetch_data()
    possible_hours = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 11, 12]

    # beginning = '''<!DOCTYPE html>
    # <html>
    # <head>
    #     <meta charset="utf-8">
    #     <meta name="viewport" content="width=device-width, initial-scale=1">
    #     <title>UVU Courses by Credit Hour</title>
    #     <link rel="stylesheet" type="text/css" href="index.css">
    #     <link rel="stylesheet" type="text/css" href="media-queries.css">
    # </head>
    # <body>
    #     <script src='index.js'></script>
    #     <h1 class='main-title'>Courses By Credit Hour</h1>
    #     <div class='courses'>
    # '''
    ending = '''
        </div>
    </body>
    </html>
    '''

    for hour in possible_hours:
        normal_nav_hours = '\n'.join([gen_link(credit_hours, False, credit_hours == hour) for credit_hours in possible_hours])
        normal_beginning = f'''<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>UVU Courses by Credit Hour - {hour}</title>
            <link rel="stylesheet" type="text/css" href="index.css">
            <link rel="stylesheet" type="text/css" href="media-queries.css">
        </head>
        <body>
            <script src="index.js"></script>
            <h1 class="main-title">Courses By Credit Hour - {hour}</h1>
            <div class="nav-container">
                <div class="hours">
                    {normal_nav_hours}
                </div>
                <a class="no-prereq" href="./{hour}-credit-hours-no-prereq.html">No Prerequisites <div></div></a>
            </div>
            <div class="courses">
        '''

        no_prereq_nav_hours = '\n'.join([gen_link(credit_hours, True, credit_hours == hour) for credit_hours in possible_hours])
        no_prereq_beginning = f'''<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>UVU Courses by Credit Hour - {hour} (No Prereq)</title>
            <link rel="stylesheet" type="text/css" href="index.css">
            <link rel="stylesheet" type="text/css" href="media-queries.css">
        </head>
        <body>
            <script src="index.js"></script>
            <h1 class="main-title">Courses By Credit Hour - {hour} (No Prereq)</h1>
            <div class="nav-container">
                <div class="hours">
                    {no_prereq_nav_hours}
                </div>
                <a class="no-prereq" href="./{gen_normal_file(hour)}">No Prerequisites <div>✓</div></a>
            </div>
            <div class="courses">
        '''

        normal = get_courses(courses, hour, False)
        no_prereq = get_courses(courses, hour, True)

        with open(f'../output/{gen_normal_file(hour)}', 'w', encoding='utf-8') as output_html:
            output_html.write(normal_beginning + normal + ending)

        with open(f'../output/{hour}-credit-hours-no-prereq.html', 'w', encoding='utf-8') as output_html:
            output_html.write(no_prereq_beginning + no_prereq + ending)


if __name__ == '__main__':
    main()
