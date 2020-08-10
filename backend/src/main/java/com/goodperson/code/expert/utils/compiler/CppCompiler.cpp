#include <vector>
#include <cstring>
#include <chrono>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <typeinfo>
#include <sstream>
typedef struct solution_result
{
    {{answerDataType}}answer;
    float timeElapsed;
} solution_result;

solution_result solution_wrapper(int timeOut)
{
    std::mutex m;
    std::condition_variable cv;
    solution_result result;
    std::thread t([&cv, &result]() {
        try
        {
            auto start = std::chrono::steady_clock::now();
            result.answer = solution({{parameterValues}});
            auto end = std::chrono::steady_clock::now();
            result.timeElapsed = std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count();
        }
        catch (std::runtime_error &e)
        {
            fprintf(stderr, "%s\n", e.what());
            fflush(stderr);
            exit(1);
        }
        cv.notify_one();
    });

    t.detach();
    {
        std::unique_lock<std::mutex> l(m);
        if (cv.wait_for(l, std::chrono::milliseconds(timeOut)) == std::cv_status::timeout)
            throw std::runtime_error("Timeout");
    }
    return result;
}

std::string to_string_output(int output){
    return std::to_string(output);
}
std::string to_string_output(long output){
    return std::to_string(output);
}
std::string to_string_output(double output){
    return std::to_string(output);
}
std::string to_string_output(bool output){
    if(output){
        return std::string("true");
    }
    else{
        return std::string("false");
    }
}
std::string to_string_output(std::string output){
    return "\""+output+"\"";
}
std::string to_string_output(std::vector<int> output){
    std::string vectorOutput = "";
    std::string prefix="[";
    std::string delimiter = ", ";
    std::string suffix = "]";
    int idx = 0;
    int vectorSize = output.size();
    vectorOutput+=prefix;
    for (auto o : output)
    {
        vectorOutput+=(to_string_output(o));
        if(idx != vectorSize -1){
            vectorOutput+=delimiter;
        }
        idx++;
    }
    vectorOutput+=suffix;
    return vectorOutput;
}
std::string to_string_output(std::vector<long> output){
    std::string vectorOutput = "";
    std::string prefix="[";
    std::string delimiter = ", ";
    std::string suffix = "]";
    int idx = 0;
    int vectorSize = output.size();
    vectorOutput+=prefix;
    for (auto o : output)
    {
        vectorOutput+=(to_string_output(o));
        if(idx != vectorSize -1){
            vectorOutput+=delimiter;
        }
        idx++;
    }
    vectorOutput+=suffix;
    return vectorOutput;
}
std::string to_string_output(std::vector<double> output){
    std::string vectorOutput = "";
    std::string prefix="[";
    std::string delimiter = ", ";
    std::string suffix = "]";
    int idx = 0;
    int vectorSize = output.size();
    vectorOutput+=prefix;
    for (auto o : output)
    {
        vectorOutput+=(to_string_output(o));
        if(idx != vectorSize -1){
            vectorOutput+=delimiter;
        }
        idx++;
    }
    vectorOutput+=suffix;
    return vectorOutput;
}
std::string to_string_output(std::vector<bool> output){
    std::string vectorOutput = "";
    std::string prefix="[";
    std::string delimiter = ", ";
    std::string suffix = "]";
    int idx = 0;
    int vectorSize = output.size();
    vectorOutput+=prefix;
    for (auto o : output)
    {
        vectorOutput+=(to_string_output(o));
        if(idx != vectorSize -1){
            vectorOutput+=delimiter;
        }
        idx++;
    }
    vectorOutput+=suffix;
    return vectorOutput;
}
std::string to_string_output(std::vector<std::string> output){
    std::string vectorOutput = "";
    std::string prefix="[";
    std::string delimiter = ", ";
    std::string suffix = "]";
    int idx = 0;
    int vectorSize = output.size();
    vectorOutput+=prefix;
    for (auto o : output)
    {
        vectorOutput+="\"";
        vectorOutput+=(o);
        vectorOutput+="\"";
        if(idx != vectorSize -1){
            vectorOutput+=delimiter;
        }
        idx++;
    }
    vectorOutput+=suffix;
    return vectorOutput;
}
int main(int argc, char **argv)
{
    try
    {
        const int timeOut = atoi(argv[1]);

        solution_result result = solution_wrapper(timeOut);
        {{answerDataType}}answer = {{answerValue}};
        {{answerDataType}}userAnswer = result.answer;
        float timeElapsed = result.timeElapsed;
        if (answer == userAnswer)
        {
            fprintf(stdout, "%s\n", "\n$answer|");
        }
        else
        {
            fprintf(stdout, "%s", "\n$notAnswer|");
            fprintf(stdout, "%s", to_string_output(answer).c_str());
            fprintf(stdout, "%s", "|");
            fprintf(stdout, "%s\n", to_string_output(userAnswer).c_str());
        }
        fprintf(stdout, "%s", "$time|");
        fprintf(stdout, "%.1f\n", timeElapsed);
        fflush(stdout);
    }
    catch (std::runtime_error &e)
    {
        if (strcmp(e.what(), "Timeout") == 0)
        {
            fprintf(stderr, "%s\n", "$timeout|");
        }
        else
        {
            fprintf(stderr, "%s\n", e.what());
        }
        fflush(stdout);
        exit(1);
    }
    return 0;
}
