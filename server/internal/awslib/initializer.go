package awslib

import (
	"context"
	"errors"
	"log"
	"sync"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/pateldivyesh1323/futflare/server/internal/awslib/s3lib"
	"github.com/pateldivyesh1323/futflare/server/internal/config"
)

var (
	awsConfigInstance *aws.Config
	s3ClientInstance  *s3.Client
	s3ServiceInstance *s3lib.Client
	initOnce          sync.Once
	initErr           error
)

func init() {
	ctx := context.Background()

	initOnce.Do(func() {
		awsConfig := NewConfig(
			config.AWSRegion,
			config.AWSAccessKey,
			config.AWSSecretKey,
			config.AWSS3Bucket,
		)

		sdkConfig, err := awsConfig.LoadAWSConfig(ctx)
		if err != nil {
			initErr = err
			log.Printf("Unable to load AWS SDK config: %v", err)
			return
		}
		awsConfigInstance = &sdkConfig

		s3ClientInstance = s3.NewFromConfig(*awsConfigInstance)

		s3ServiceInstance = s3lib.New(s3ClientInstance)

		log.Println("AWS services initialized successfully")
	})
}

func Initialize(ctx context.Context) error {
	initOnce.Do(func() {
		awsConfig := NewConfig(
			config.AWSRegion,
			config.AWSAccessKey,
			config.AWSSecretKey,
			config.AWSS3Bucket,
		)

		sdkConfig, err := awsConfig.LoadAWSConfig(ctx)
		if err != nil {
			initErr = err
			log.Printf("Unable to load AWS SDK config: %v", err)
			return
		}
		awsConfigInstance = &sdkConfig

		s3ClientInstance = s3.NewFromConfig(*awsConfigInstance)
		s3ServiceInstance = s3lib.New(s3ClientInstance)
	})

	return initErr
}

func GetAWSConfig() (*aws.Config, error) {
	if awsConfigInstance == nil {
		return nil, ErrNotInitialized
	}
	return awsConfigInstance, nil
}

func GetS3Client() (*s3.Client, error) {
	if s3ClientInstance == nil {
		return nil, ErrNotInitialized
	}
	return s3ClientInstance, nil
}

func GetS3Service() (*s3lib.Client, error) {
	if s3ServiceInstance == nil {
		return nil, ErrNotInitialized
	}
	return s3ServiceInstance, nil
}

var ErrNotInitialized = errors.New("aws services not initialized, call Initialize() first")

func InitializeAWSConfig(ctx context.Context) (*aws.Config, error) {
	if awsConfigInstance == nil {
		if err := Initialize(ctx); err != nil {
			return nil, err
		}
	}
	return awsConfigInstance, nil
}

func InitializeS3Client(ctx context.Context, awsConfig *aws.Config) (*s3.Client, error) {
	if s3ClientInstance == nil {
		if err := Initialize(ctx); err != nil {
			return nil, err
		}
	}
	return s3ClientInstance, nil
}
