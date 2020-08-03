package com.goodperson.code.expert.controller.problem;

import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.URLConnection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import com.goodperson.code.expert.dto.RegisterOrUpdateProblemRequestDto;
import com.goodperson.code.expert.service.ProblemService;
import com.goodperson.code.expert.utils.FileUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class ProblemController {
    @Autowired
    private ProblemService problemService;
    @Autowired
    private FileUtils fileUtils;
    @PostMapping("/registerProblem")
    public ResponseEntity<?> makeProblem(
            @RequestBody RegisterOrUpdateProblemRequestDto registerOrUpdateProblemRequestDto) {
        Map<String, Object> result = new HashMap<>();
        result.put("regiser_success", true);
        // result.put("error_message", "오류");
        return new ResponseEntity<>(registerOrUpdateProblemRequestDto, HttpStatus.OK);

    }

    @PostMapping("/uploadProblemImage")
    public ResponseEntity<?> uploadProblemImage(@RequestParam("files[]") MultipartFile[] files) throws Exception {
        List<String> urls = problemService.uploadProblemImage(files);
        return new ResponseEntity<>(Collections.singletonMap("urls", urls), HttpStatus.OK);
    }

    @GetMapping("/images/{savedFileName}")
    public void getProblemImage(@PathVariable(required = true) String savedFileName, HttpServletResponse response){
        File imageUploadDirectory = fileUtils.getImageUploadDirectory();
        File savedImageFile = new File(imageUploadDirectory, savedFileName);
		if (!savedImageFile.exists()) {
			response.setStatus(404);
			return;
		}

		String contentType = URLConnection.guessContentTypeFromName(savedImageFile.getAbsolutePath());

		long fileLength = savedImageFile.length();
		response.setHeader("Content-Disposition", "attachment; filename=\"" + savedImageFile.getName() + "\";");
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Content-Type", contentType);
		response.setHeader("Content-Length", "" + fileLength);
		response.setHeader("Pragma", "no-cache;");
		response.setHeader("Expires", "-1;");

		writeFile(response, savedImageFile);
    }

    private void writeFile(HttpServletResponse response, File file) {
		try (FileInputStream fis = new FileInputStream(file); OutputStream out = response.getOutputStream();) {
			int readCount = 0;
			byte[] buffer = new byte[256];
			while ((readCount = fis.read(buffer)) != -1) {
				out.write(buffer, 0, readCount);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			response.setStatus(404);
		}

	}
}