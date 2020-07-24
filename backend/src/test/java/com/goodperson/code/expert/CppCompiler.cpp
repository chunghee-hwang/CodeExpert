#include <vector>
#include <numeric>
#include <string>
#include <Windows.h>
#include <cmath>
int solution(std::vector<int> array)
{
    Sleep(1000);
    return std::accumulate(array.begin(), array.end(), 0);
}

#include <iostream>
#include <vector>
#include <cstring>
#include <ctime>

int main(int argc, char **argv)
{
    const clock_t startTime = clock();
    std::cout.precision(1);
    auto userAnswer = solution(std::vector<int>{1, 2, 3, 4});
    const float timeElapsed = (float(clock() - startTime) / CLOCKS_PER_SEC) * 1000;
    auto answer = 12;
    if (answer == userAnswer)
    {
        fprintf(stdout, "%s\n", "$answer");
        fflush(stdout);
    }
    else
    {
        fprintf(stdout, "%s", "$not_answer|");
        fprintf(stdout, "%s", std::to_string(answer).c_str());
        fprintf(stdout, "%s", "|");
        fprintf(stdout, "%s\n", std::to_string(userAnswer).c_str());
        fflush(stdout);
    }
    fprintf(stdout, "%s", "$time|");
    fprintf(stdout, "%.1f\n", timeElapsed);
    fflush(stdout);
    return 0;
}
